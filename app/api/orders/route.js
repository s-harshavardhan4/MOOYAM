import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getDb } from "@/lib/mongodb";
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
    let client;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const { db: database } = await getDb("cosmeticsdb");

        // Use an aggregation pipeline to fetch orders for this specific userId
        const orders = await database.collection("Order").aggregate([
            { $match: { userId: userId } },
            { $sort: { createdAt: -1 } },
            // Join Address
            {
                $lookup: {
                    from: "Address",
                    let: { searchId: "$addressId" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$searchId"] } } }
                    ],
                    as: "addressDoc"
                }
            },
            { $unwind: { path: "$addressDoc", preserveNullAndEmptyArrays: true } },
            // Join OrderItems
            {
                $lookup: {
                    from: "OrderItem",
                    let: { order_id_string: { $toString: "$_id" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$orderId", "$$order_id_string"] } } }
                    ],
                    as: "orderItems"
                }
            }
        ]).toArray();

        // Format mapping to match frontend expectations
        const formattedOrders = orders.map(order => {
            return {
                id: order._id.toString(),
                total: order.total,
                status: order.status,
                paymentMethod: order.paymentMethod,
                isPaid: order.isPaid,
                isCouponUsed: order.isCouponUsed,
                coupon: order.coupon === "{}" ? null : order.coupon,
                createdAt: order.createdAt,

                address: order.addressDoc ? {
                    id: order.addressDoc._id.toString(),
                    name: order.addressDoc.name || session.user.name || "Customer",
                    phone: order.addressDoc.phone,
                    street: order.addressDoc.street,
                    city: order.addressDoc.city,
                    state: order.addressDoc.state,
                    country: order.addressDoc.country,
                    zip: order.addressDoc.zip
                } : null,

                orderItems: order.orderItems.map(item => ({
                    id: item._id.toString(),
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
        });

        return NextResponse.json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const { success } = await checkRateLimit(`order_${ip}`, 10, 3600000); // 10 orders per hour

        if (!success) {
            return NextResponse.json({ success: false, message: 'Too many order attempts. Please try again later.' }, { status: 429 });
        }

        const body = await request.json();
        const { total, items, addressId, paymentMethod, coupon } = body;

        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        if (!total || !items || !items.length || !addressId || !paymentMethod) {
            return NextResponse.json({ success: false, message: 'Missing required order fields' }, { status: 400 });
        }

        const { db: database } = await getDb("cosmeticsdb");

        const productIds = items.map(item => item.id || item.productId);
        const dbProducts = await database.collection("Product").find(
            { _id: { $in: productIds.map(id => new ObjectId(id)) } }
        ).toArray();

        const dbProductMap = new Map(dbProducts.map(p => [p._id.toString(), p]));

        const verifiedTotal = dbProducts.reduce((sum, dbProduct) => {
            const cartItem = items.find(i => (i.id || i.productId) === dbProduct._id.toString());
            return sum + (dbProduct.price * (cartItem?.quantity || 1));
        }, 0);

        const orderItemsList = items.map(item => {
            const productId = item.id || item.productId;
            const dbProduct = dbProductMap.get(productId);
            return {
                productId,
                quantity: item.quantity || 1,
                price: dbProduct ? dbProduct.price : 0,
            };
        });

        const orderData = {
            userId: userId,
            total: verifiedTotal,
            status: "ORDER_PLACED",
            paymentMethod,
            addressId,
            isPaid: false,
            isCouponUsed: !!coupon,
            coupon: coupon || "{}",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const ordersCollection = database.collection("Order");
        const orderItemsCollection = database.collection("OrderItem");

        const orderResult = await ordersCollection.insertOne(orderData);
        const orderIdString = orderResult.insertedId.toString();

        const rawOrderItems = orderItemsList.map(item => ({
            ...item,
            orderId: orderIdString
        }));

        if (rawOrderItems.length > 0) {
            await orderItemsCollection.insertMany(rawOrderItems);
        }

        delete orderData._id;
        rawOrderItems.forEach(item => delete item._id);

        const newOrder = {
            ...orderData,
            id: orderIdString,
            orderItems: rawOrderItems
        };

        return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
    }
}
