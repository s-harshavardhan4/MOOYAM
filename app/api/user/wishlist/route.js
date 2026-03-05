import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

// GET user's saved items (wishlist)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Admin Accounts do not exist in MongoDB User table
        if (session.user.email === 'admin@mooyan.com') {
            return NextResponse.json({ success: true, savedItems: [], savedItemIds: [] });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        // User.savedItems is an array of Product IDs
        const savedItemsIds = user.savedItems || [];

        // Fetch the actual product objects that match these IDs
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: savedItemsIds
                }
            }
        });

        return NextResponse.json({
            success: true,
            savedItems: products,
            savedItemIds: savedItemsIds // Sending IDs for quick client-side checking
        });

    } catch (error) {
        console.error("Wishlist GET Error:", error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message, stack: error.stack }, { status: 500 });
    }
}

// POST to toggle a product in the wishlist
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Admin Accounts do not exist in MongoDB User table
        if (session.user.email === 'admin@mooyan.com') {
            return NextResponse.json({ success: false, message: 'Admin accounts cannot save items' }, { status: 403 });
        }

        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        let currentSavedItems = user.savedItems || [];
        let isSaved = false;

        // Toggle logic
        if (currentSavedItems.includes(productId)) {
            // Remove it
            currentSavedItems = currentSavedItems.filter(id => id !== productId);
            isSaved = false;
        } else {
            // Add it
            currentSavedItems.push(productId);
            isSaved = true;
        }

        // Update database using raw command to bypass Prisma's transaction requirement for arrays on MongoDB standalone
        await prisma.$runCommandRaw({
            update: "User",
            updates: [
                {
                    q: { _id: { $oid: session.user.id } },
                    u: { $set: { savedItems: currentSavedItems } }
                }
            ]
        });

        let productData = null;
        if (isSaved) {
            productData = await prisma.product.findUnique({
                where: { id: productId }
            });
        }

        return NextResponse.json({
            success: true,
            message: isSaved ? 'Added to saved items' : 'Removed from saved items',
            isSaved,
            savedItemIds: currentSavedItems,
            product: productData
        });

    } catch (error) {
        console.error("Wishlist POST Error:", error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message, stack: error.stack }, { status: 500 });
    }
}
