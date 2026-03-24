import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
    let client;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        const { db: database } = await getDb("cosmeticsdb");
        const addressesCollection = database.collection("Address");

        const addresses = await addressesCollection
            .find({ userId: userId })
            .sort({ createdAt: -1 })
            .toArray();

        const formattedAddresses = addresses.map(addr => ({
            ...addr,
            id: addr._id.toString()
        }));

        return NextResponse.json({ success: true, addresses: formattedAddresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch addresses' }, { status: 500 });
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

        const { db: database } = await getDb("cosmeticsdb");
        const addressesCollection = database.collection("Address");

        const result = await addressesCollection.insertOne(addressData);

        const newAddress = {
            ...addressData,
            id: result.insertedId.toString()
        };

        return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
    } catch (error) {
        console.error('Error creating address:', error);
        return NextResponse.json({ success: false, message: 'Failed to create address' }, { status: 500 });
    }
}
