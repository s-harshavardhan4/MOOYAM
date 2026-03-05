import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
        }

        // 1. Find the user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return NextResponse.json({ success: false, message: 'Account not found. Please sign up.' }, { status: 404 });
        }

        // 2. Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
        }

        // 3. Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 4. Set expiration to exactly 5 minutes from now
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);

        // 5. Save OTP to database
        await prisma.user.update({
            where: { email },
            data: {
                otp,
                otpExpiresAt,
            }
        });

        // 6. Send the email (Fallback to console for dev if credentials are missing)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail', // Change if using another provider
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Login Verification Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #f7e8e8; padding: 20px; text-align: center;">
                            <h1 style="color: #333; margin: 0; font-size: 24px;">Verification Code</h1>
                        </div>
                        <div style="padding: 30px; text-align: center;">
                            <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Please use the following code to complete your login. This code will expire in exactly 5 minutes.</p>
                            <div style="background-color: #f4f4f4; border-radius: 6px; padding: 15px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1a1a1a; margin-bottom: 20px;">
                                ${otp}
                            </div>
                            <p style="color: #999; font-size: 14px;">If you did not request this code, please ignore this email.</p>
                        </div>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.log('\n\n==========================================');
            console.log(`✉️ NO EMAIL CREDENTIALS FOUND.`);
            console.log(`🔑 DEV MODE OTP FOR ${email}: ${otp}`);
            console.log('==========================================\n\n');
        }

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
    }
}
