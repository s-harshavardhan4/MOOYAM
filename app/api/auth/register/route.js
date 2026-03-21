import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request) {

    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
        const { success } = await checkRateLimit(`register_${ip}`, 5, 3600000); // 5 registrations per hour

        if (!success) {
            return NextResponse.json({ success: false, message: 'Too many registration attempts. Please try again later.' }, { status: 429 });
        }

        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
        }
        if (!/[A-Z]/.test(password)) {
            return NextResponse.json({ success: false, message: 'Password must contain at least one uppercase letter' }, { status: 400 });
        }
        if (!/[a-z]/.test(password)) {
            return NextResponse.json({ success: false, message: 'Password must contain at least one lowercase letter' }, { status: 400 });
        }
        if (!/[0-9]/.test(password)) {
            return NextResponse.json({ success: false, message: 'Password must contain at least one number' }, { status: 400 });
        }

        const { db } = await getDb();
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
        return NextResponse.json({ success: false, message: 'An error occurred during registration' }, { status: 500 });
    }
}

