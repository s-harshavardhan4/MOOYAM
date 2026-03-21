import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const uri = "mongodb://127.0.0.1:27017";
    console.log('Connecting to MongoDB with HARDCODED URI:', uri);
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("cosmeticsdb");

    cachedClient = client;
    cachedDb = db;

    return { client, db };
}

export async function GET() {
    try {
        const { db } = await connectToDatabase();
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
        return NextResponse.json({ success: false, message: 'Failed to fetch products', error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, price, mrp, quantity, inStock } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

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
