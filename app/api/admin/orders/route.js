import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
    let client;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.isAdmin) {
            return NextResponse.json({ success: false, message: 'Unauthorized Admin Access' }, { status: 401 });
        }

        const { db: database } = await getDb("cosmeticsdb");

        // Use an aggregation pipeline to left-join users, addresses, and orderItems
        const orders = await database.collection("Order").aggregate([
            { $sort: { createdAt: -1 } },
            // Join User
            {
                $lookup: {
                    from: "User",
                    let: { searchId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$searchId"] } } }
                    ],
                    as: "userDoc"
                }
            },
            { $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true } },
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

        // Format mapping to match what the frontend expects
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

                user: order.userDoc ? {
                    id: order.userDoc._id.toString(),
                    name: order.userDoc.name,
                    email: order.userDoc.email
                } : null,

                address: order.addressDoc ? {
                    id: order.addressDoc._id.toString(),
                    name: order.addressDoc.name,
                    phone: order.addressDoc.phone,
                    street: order.addressDoc.street,
                    city: order.addressDoc.city,
                    state: order.addressDoc.state,
                    country: order.addressDoc.country,
                    zip: order.addressDoc.zip
                } : null,

                // We won't join Product collection dynamically because dummy products use "prod_mooyam_x" strings which cause ObjectId lookup errors.
                // We'll pass the raw orderItems and let the frontend hydrate products from assets.js directly or fallback gracefully.
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
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch admin orders' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.isAdmin) {
            return NextResponse.json({ success: false, message: 'Unauthorized Admin Access' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId, status, isPaid } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, message: 'Missing orderId' }, { status: 400 });
        }

        const { db: database } = await getDb("cosmeticsdb");
        const orders = database.collection("Order");

        // Prepare the update object
        const updateData = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (typeof isPaid === 'boolean') updateData.isPaid = isPaid;

        // If status is being set to DELIVERED, automatically mark COD as paid
        if (status === 'DELIVERED') {
            const order = await orders.findOne({ _id: new ObjectId(orderId) });
            if (order && order.paymentMethod && order.paymentMethod.trim().toUpperCase() === 'COD') {
                updateData.isPaid = true;
            }
        }

        const result = await orders.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ success: false, message: 'Failed to update order status' }, { status: 500 });
    }
}
