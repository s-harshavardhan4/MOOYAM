import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const { db } = await getDb();

        // Aggregate Product sales from OrderItem collection
        const stats = await db.collection("OrderItem").aggregate([
            {
                $group: {
                    _id: "$productId",
                    salesCount: { $sum: "$quantity" }
                }
            }
        ]).toArray();

        const statsMap = new Map(stats.map(s => [s._id, s.salesCount]));

        const products = await db.collection("Product").find({}).toArray();

        const formattedProducts = products.map(p => {
            const id = p._id.toString();
            return {
                ...p,
                id,
                salesCount: statsMap.get(id) || 0
            };
        });

        return NextResponse.json({ success: true, products: formattedProducts });
    } catch (error) {
        console.error('SERVER_ERROR [GET /api/admin/products/stats]:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch product stats' }, { status: 500 });
    }
}
