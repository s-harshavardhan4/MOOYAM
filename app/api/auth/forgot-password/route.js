import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';

export async function POST(request) {
    let client;
    try {
        const body = await request.json();
        const { email, otp, newPassword } = body;

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const { db } = await getDb('cosmeticsdb');
        const collection = db.collection('User');

        const user = await collection.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found with this email' }, { status: 404 });
        }

        if (otp && newPassword) {
            const storedOtp = user.resetOtp;
            const otpExpiry = user.resetOtpExpiry;

            if (!storedOtp || !otpExpiry || new Date() > new Date(otpExpiry)) {
                return NextResponse.json({ success: false, message: 'OTP has expired. Please request a new one.' }, { status: 400 });
            }

            if (storedOtp !== otp) {
                return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
            }

            if (newPassword.length < 8) {
                return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            await collection.updateOne(
                { email: email.toLowerCase() },
                {
                    $set: {
                        password: hashedPassword,
                        resetOtp: null,
                        resetOtpExpiry: null,
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.json({ success: true, message: 'Password reset successfully' });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await collection.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    resetOtp: newOtp,
                    resetOtpExpiry: otpExpiry,
                    updatedAt: new Date()
                }
            }
        );

        console.log(`[DEV] OTP for ${email}: ${newOtp}`);

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email',
            devOtp: process.env.NODE_ENV === 'development' ? newOtp : undefined
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
}
