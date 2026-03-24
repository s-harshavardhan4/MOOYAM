import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
    try {
        const { db } = await getDb();
        const products = await db.collection("Product").find({}).sort({ createdAt: -1 }).toArray();

        console.log(`Successfully fetched ${products.length} products`);

        // Convert _id to string
        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString()
        }));

        return NextResponse.json({ success: true, products: formattedProducts });
    } catch (error) {
        console.error('SERVER_ERROR [GET /api/products]:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { id, price, mrp, quantity, inStock } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
        }

        const { db } = await getDb();

        let updateFields = {};
        if (price !== undefined) updateFields.price = parseFloat(price);
        if (mrp !== undefined) updateFields.mrp = parseFloat(mrp);
        if (quantity !== undefined) updateFields.quantity = parseInt(quantity, 10);
        if (inStock !== undefined) updateFields.inStock = Boolean(inStock);
        updateFields.updatedAt = new Date();

        const result = await db.collection("Product").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.isAdmin) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, mrp, price, category, subCategory, images, quantity } = body;

        if (!name || !price || !category) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const { db } = await getDb();

        const newProduct = {
            name,
            description,
            mrp: parseFloat(mrp) || 0,
            price: parseFloat(price),
            category,
            subCategory: subCategory || null,
            images: images || [],
            quantity: parseInt(quantity, 10) || 0,
            inStock: (parseInt(quantity, 10) || 0) > 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("Product").insertOne(newProduct);

        return NextResponse.json({ 
            success: true, 
            message: 'Product created successfully', 
            productId: result.insertedId.toString() 
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 500 });
    }
}
