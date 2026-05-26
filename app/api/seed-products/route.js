export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { productDummyData } from '@/assets/assets';

const uri = process.env.DATABASE_URL;

export async function GET() {
    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        const database = client.db("cosmeticsdb");
        const productsCollection = database.collection("Product");

        // Clear existing just in case
        await productsCollection.deleteMany({});

        const dataToSeed = productDummyData.map(p => ({
            name: p.name,
            description: p.description,
            mrp: parseFloat(p.mrp),
            price: parseFloat(p.price),
            images: p.images,
            category: p.category || 'SkinCare',
            subCategory: p.subCategory || 'Creams',
            inStock: p.inStock !== false,
            quantity: 20,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        const result = await productsCollection.insertMany(dataToSeed);

        return NextResponse.json({ success: true, message: 'Products seeded successfully', count: result.insertedCount });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, message: 'Failed to seed products' }, { status: 500 });
    } finally {
        if (client) await client.close();
    }
}
