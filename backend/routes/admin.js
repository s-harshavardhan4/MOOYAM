import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';

const router = express.Router();

// GET /api/admin/products/stats - Fetch products with sales stats
router.get('/products/stats', async (req, res) => {
    try {
        const db = await getDb();

        const products = await db.collection('Product').find({}).toArray();

        // Aggregate sales count from OrderItem
        const pipeline = [
            { $group: { _id: '$productId', totalSold: { $sum: '$quantity' } } }
        ];
        const salesStats = await db.collection('OrderItem').aggregate(pipeline).toArray();
        const statsMap = new Map(salesStats.map(s => [s._id, s.totalSold]));

        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString(),
            salesCount: statsMap.get(p._id.toString()) || 0
        }));

        // Consolidate and Enrich Latest Reviews for Dashboard
        const allRatings = products.flatMap(p => (p.rating || []).map(r => ({
            ...r,
            product: {
                id: p._id.toString(),
                name: p.name,
                category: p.category
            }
        })));

        // Sort by date descending
        allRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get latest 10 and populate User info
        const latestRatings = allRatings.slice(0, 10);
        const enrichedRatings = await Promise.all(latestRatings.map(async (rate) => {
            try {
                if (rate.userId && ObjectId.isValid(rate.userId)) {
                    const user = await db.collection('User').findOne({ _id: new ObjectId(rate.userId) });
                    if (user) {
                        return {
                            ...rate,
                            user: {
                                name: user.name || 'User',
                                image: user.image || ''
                            }
                        };
                    }
                }
            } catch (_) {}
            return {
                ...rate,
                user: { name: 'User', image: '' }
            };
        }));

        res.json({
            success: true,
            products: formattedProducts,
            latestReviews: enrichedRatings
        });
    } catch (error) {
        console.error('BACKEND_ERROR [GET /api/admin/products/stats]:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch product stats' });
    }
});

// GET /api/admin/orders - Fetch all orders with details
router.get('/orders', async (req, res) => {
    try {
        const db = await getDb();

        const orders = await db.collection('Order').find({}).sort({ createdAt: -1 }).toArray();

        // Enrich with address and orderItems
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            let address = null;
            try {
                if (order.addressId && ObjectId.isValid(order.addressId)) {
                    address = await db.collection('Address').findOne({ _id: new ObjectId(order.addressId) });
                }
            } catch (_) {}

            let orderItems = [];
            try {
                orderItems = await db.collection('OrderItem').find({ orderId: order._id.toString() }).toArray();

                // Enrich each item with product info
                orderItems = await Promise.all(orderItems.map(async (item) => {
                    let product = null;
                    try {
                        if (item.productId && ObjectId.isValid(item.productId)) {
                            product = await db.collection('Product').findOne({ _id: new ObjectId(item.productId) });
                        }
                    } catch (_) {}
                    return { ...item, id: item._id.toString(), product };
                }));
            } catch (_) {}

            return {
                ...order,
                id: order._id.toString(),
                address,
                orderItems
            };
        }));

        res.json({ success: true, orders: enrichedOrders });
    } catch (error) {
        console.error('BACKEND_ERROR [GET /api/admin/orders]:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin orders' });
    }
});

// POST /api/admin/orders - Update order status or payment status
router.post('/orders', async (req, res) => {
    try {
        const db = await getDb();
        const { orderId, status, isPaid } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Missing order ID' });
        }

        const updateData = { updatedAt: new Date() };
        if (status !== undefined) updateData.status = status;
        if (isPaid !== undefined) updateData.isPaid = isPaid;

        // Auto-mark COD as paid when delivered
        const order = await db.collection('Order').findOne({ _id: new ObjectId(orderId) });
        if (status === 'DELIVERED' && order?.paymentMethod === 'COD') {
            updateData.isPaid = true;
        }

        await db.collection('Order').updateOne(
            { _id: new ObjectId(orderId) },
            { $set: updateData }
        );

        const updatedOrder = await db.collection('Order').findOne({ _id: new ObjectId(orderId) });

        res.json({ success: true, message: 'Order updated successfully', order: { ...updatedOrder, id: updatedOrder._id.toString() } });
    } catch (error) {
        console.error('BACKEND_ERROR [POST /api/admin/orders]:', error);
        res.status(500).json({ success: false, message: 'Failed to update order' });
    }
});

// GET /api/admin/transactions - Fetch all paid orders as transactions
router.get('/transactions', async (req, res) => {
    try {
        const db = await getDb();

        const transactions = await db.collection('Order').find({
            $or: [
                { isPaid: true },
                { paymentMethod: 'STRIPE' }
            ]
        }).sort({ createdAt: -1 }).toArray();

        const enrichedTransactions = await Promise.all(transactions.map(async (txn) => {
            let address = null;
            try {
                if (txn.addressId && ObjectId.isValid(txn.addressId)) {
                    address = await db.collection('Address').findOne({ _id: new ObjectId(txn.addressId) });
                }
            } catch (_) {}

            let orderItems = [];
            try {
                orderItems = await db.collection('OrderItem').find({ orderId: txn._id.toString() }).toArray();

                // Enrich each item with product info
                orderItems = await Promise.all(orderItems.map(async (item) => {
                    let product = null;
                    try {
                        if (item.productId && ObjectId.isValid(item.productId)) {
                            product = await db.collection('Product').findOne({ _id: new ObjectId(item.productId) });
                        }
                    } catch (_) {}
                    return { ...item, id: item._id.toString(), product };
                }));
            } catch (_) {}

            return {
                id: txn._id.toString(),
                customerName: address?.name || 'Customer',
                customerEmail: address?.email || 'N/A',
                total: txn.total,
                paymentMethod: txn.paymentMethod,
                isPaid: txn.isPaid,
                createdAt: txn.createdAt,
                orderItems
            };
        }));

        res.json({ success: true, transactions: enrichedTransactions });
    } catch (error) {
        console.error('BACKEND_ERROR [GET /api/admin/transactions]:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
    }
});

export default router;
