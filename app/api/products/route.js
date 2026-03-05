import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export async function GET() {
    try {
        await client.connect();
        const database = client.db("cosmeticsdb");
        const products = await database.collection("Product").find({}).sort({ createdAt: -1 }).toArray();

        // Convert _id to string
        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString()
        }));

        return NextResponse.json({ success: true, products: formattedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch products' }, { status: 500 });
    } finally {
        await client.close();
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, price, mrp, quantity, inStock } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing product ID' }, { status: 400 });
        }

        await client.connect();
        const database = client.db("cosmeticsdb");

        let updateFields = {};
        if (price !== undefined) updateFields.price = parseFloat(price);
        if (mrp !== undefined) updateFields.mrp = parseFloat(mrp);
        if (quantity !== undefined) updateFields.quantity = parseInt(quantity, 10);
        if (inStock !== undefined) updateFields.inStock = Boolean(inStock);
        updateFields.updatedAt = new Date();

        const result = await database.collection("Product").updateOne(
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
    } finally {
        await client.close();
    }
}
