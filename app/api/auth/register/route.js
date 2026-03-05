import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri);

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        await client.connect();
        const database = client.db("cosmeticsdb");
        const users = database.collection("User");

        // Check if user already exists
        const existingUser = await users.findOne({ email: email });

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists with this email' }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await users.insertOne({
            name,
            email,
            password: hashedPassword,
            image: '',
            cart: '{}'
        });

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: result.insertedId.toString(),
                name: name,
                email: email
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred during registration', error: error.message }, { status: 500 });
    } finally {
        await client.close();
    }
}
