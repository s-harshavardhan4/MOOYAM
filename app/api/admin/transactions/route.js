import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.isAdmin) {
            return NextResponse.json({ success: false, message: 'Unauthorized Admin Access' }, { status: 401 });
        }

        await client.connect();
        const database = client.db("cosmeticsdb");

        // Fetch only orders where payment method is not COD (i.e., STRIPE)
        const transactions = await database.collection("Order").aggregate([
            { $match: { paymentMethod: { $ne: 'COD' } } },
            { $sort: { createdAt: -1 } },
            // Join User for customer name
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
            // Join Address (fallback for customer name if user lacks it)
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
            { $unwind: { path: "$addressDoc", preserveNullAndEmptyArrays: true } }
        ]).toArray();

        // Format mapping
        const formattedTransactions = transactions.map(order => {
            return {
                id: order._id.toString(), // Acts as Transaction ID
                total: order.total,
                status: order.status,
                paymentMethod: order.paymentMethod,
                isPaid: order.isPaid,
                createdAt: order.createdAt,
                customerName: order.userDoc?.name || order.addressDoc?.name || "Unknown Customer",
                customerEmail: order.userDoc?.email || order.addressDoc?.email || "N/A"
            };
        });

        return NextResponse.json({ success: true, transactions: formattedTransactions });
    } catch (error) {
        console.error('Error fetching admin transactions:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch admin transactions' }, { status: 500 });
    } finally {
        await client.close();
    }
}
