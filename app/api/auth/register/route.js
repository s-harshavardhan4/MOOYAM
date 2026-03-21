import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    const uri = process.env.DATABASE_URL;
    const client = new MongoClient(uri);

    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        await client.connect();
        const db = client.db(); // Uses DB from connection string
        const collection = db.collection('User');

        // Check if user already exists
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists with this email' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            image: '',
            cart: {},
            savedItems: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newUser);

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: result.insertedId,
                name: newUser.name,
                email: newUser.email
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred during registration', error: error.message }, { status: 500 });
    } finally {
        await client.close();
    }
}

