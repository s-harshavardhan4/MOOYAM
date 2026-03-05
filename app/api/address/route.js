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
        const addressesCollection = database.collection("Address");

        const addresses = await addressesCollection
            .find({ userId: userId })
            .sort({ createdAt: -1 })
            .toArray();

        // Convert _id to string for the frontend
        const formattedAddresses = addresses.map(addr => ({
            ...addr,
            id: addr._id.toString()
        }));

        return NextResponse.json({ success: true, addresses: formattedAddresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch addresses', error: error.message }, { status: 500 });
    } finally {
        // Not closing the client to reuse connections in serverless functions is common, but closing it here to be safe and match the previous script
        await client.close();
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, street, city, state, zip, country, phone } = body;

        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        if (!name || !email || !street || !city || !state || !zip || !country || !phone) {
            return NextResponse.json({ success: false, message: 'Missing required address fields' }, { status: 400 });
        }

        const addressData = {
            userId: userId,
            name,
            email,
            street,
            city,
            state,
            zip,
            country,
            phone,
            createdAt: new Date()
        };

        await client.connect();
        const database = client.db("cosmeticsdb");
        const addressesCollection = database.collection("Address");

        const result = await addressesCollection.insertOne(addressData);

        const newAddress = {
            ...addressData,
            id: result.insertedId.toString()
        };

        return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
    } catch (error) {
        console.error('Error creating address:', error);
        return NextResponse.json({ success: false, message: 'Failed to create address', error: error.message }, { status: 500 });
    } finally {
        await client.close();
    }
}
