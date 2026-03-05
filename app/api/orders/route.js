import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        await client.connect();
        const database = client.db("cosmeticsdb");

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
    } finally {
        await client.close();
    }
}

export async function POST(request) {
    try {
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

        // Manual construct Order and OrderItems without transactions
        const orderData = {
            userId: userId,
            total: parseFloat(total),
            status: "ORDER_PLACED",
            paymentMethod,
            addressId,
            isPaid: false, // Default to false
            isCouponUsed: !!coupon,
            coupon: coupon || "{}",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const orderItemsList = items.map(item => ({
            productId: item.id || item.productId, // Handle different variations of item shape
            quantity: item.quantity || 1,
            price: parseFloat(item.price || item.mrp || 0),
        }));

        await client.connect();
        const database = client.db("cosmeticsdb");
        const ordersCollection = database.collection("Order");
        const orderItemsCollection = database.collection("OrderItem");

        // Create Order first
        const orderResult = await ordersCollection.insertOne(orderData);
        const orderIdString = orderResult.insertedId.toString();

        // Attach orderId and _id ObjectIds for items
        const rawOrderItems = orderItemsList.map(item => ({
            ...item,
            orderId: orderIdString
        }));

        if (rawOrderItems.length > 0) {
            await orderItemsCollection.insertMany(rawOrderItems);
        }

        // The MongoDB driver automatically mutates the object and adds an ObjectId `_id` property
        // NextResponse.json will fail to serialize `ObjectId`, so we must delete them before responding.
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
        return NextResponse.json({ success: false, message: 'Failed to create order', error: error.message }, { status: 500 });
    } finally {
        await client.close();
    }
}
