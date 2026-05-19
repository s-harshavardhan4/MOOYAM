import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';
import { checkRateLimit } from '../lib/rate-limit.js';

const router = express.Router();

// GET /api/orders - Fetch user orders
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await getDb();

        // Fetch all orders for this user, newest first
        const orders = await db.collection('Order')
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();

        // Enrich each order with its items + product info + address
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            let address = null;
            try {
                if (order.addressId && ObjectId.isValid(order.addressId)) {
                    address = await db.collection('Address').findOne({ _id: new ObjectId(order.addressId) });
                    if (address) address = { ...address, id: address._id.toString() };
                }
            } catch (_) {}

            let orderItems = [];
            try {
                orderItems = await db.collection('OrderItem')
                    .find({ orderId: order._id.toString() })
                    .toArray();

                orderItems = await Promise.all(orderItems.map(async (item) => {
                    let product = null;
                    try {
                        if (item.productId && ObjectId.isValid(item.productId)) {
                            product = await db.collection('Product').findOne({ _id: new ObjectId(item.productId) });
                            if (product) product = { ...product, id: product._id.toString() };
                        }
                    } catch (_) {}
                    return { ...item, id: item._id.toString(), product };
                }));
            } catch (_) {}

            return { ...order, id: order._id.toString(), orderItems, address };
        }));

        res.json({ success: true, orders: enrichedOrders });

    } catch (error) {
        console.error('BACKEND_ERROR [GET /api/orders]:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
});

// POST /api/orders - Create a new order
router.post('/', async (req, res) => {
    try {
        const ip = req.ip || '127.0.0.1';
        const { success } = await checkRateLimit(`order_${ip}`, 10, 3600000);

        if (!success) {
            return res.status(429).json({ success: false, message: 'Too many order attempts. Please try again later.' });
        }

        const { total, items, addressId, paymentMethod, coupon, userId } = req.body;

        if (!userId || !total || !items || !items.length || !addressId || !paymentMethod) {
            return res.status(400).json({ success: false, message: 'Missing required order fields' });
        }

        const db = await getDb();
        const productIds = items.map(item => item.id || item.productId).filter(id => ObjectId.isValid(id));
        
        // Validate stock using Native Driver
        const products = await db.collection('Product').find({
            _id: { $in: productIds.map(id => new ObjectId(id)) }
        }).toArray();

        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        for (const item of items) {
            const productId = item.id || item.productId;
            const product = productMap.get(productId);
            const requestedQty = item.quantity || 1;

            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${productId}` });
            }

            if (!product.inStock || product.quantity < requestedQty) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for ${product.name}. ${product.quantity || 0} left.` 
                });
            }
        }

        const ordersCol = db.collection('Order');
        const orderItemsCol = db.collection('OrderItem');
        const productsCol = db.collection('Product');

        // 1. Create the order base
        const orderDoc = {
            userId,
            total,
            status: "ORDER_PLACED",
            paymentMethod,
            addressId,
            isPaid: false,
            isCouponUsed: !!coupon,
            coupon: coupon || {},
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const orderResult = await ordersCol.insertOne(orderDoc);
        const orderId = orderResult.insertedId;

        // 2. Create OrderItems
        const orderItemsDocs = items.map(item => ({
            orderId: orderId.toString(),
            productId: item.id || item.productId,
            quantity: item.quantity || 1,
            price: productMap.get(item.id || item.productId).price
        }));

        await orderItemsCol.insertMany(orderItemsDocs);

        // 3. Decrement stock
        for (const item of items) {
            const productId = item.id || item.productId;
            const qty = item.quantity || 1;
            const product = productMap.get(productId);
            
            await productsCol.updateOne(
                { _id: new ObjectId(productId) },
                { 
                    $inc: { quantity: -qty },
                    $set: { inStock: (product.quantity - qty) > 0 }
                }
            );
        }

        res.status(201).json({ success: true, orderId: orderId.toString() });

    } catch (error) {
        console.error('BACKEND_ERROR [POST /api/orders]:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

export default router;
