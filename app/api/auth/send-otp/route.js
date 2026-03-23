import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sendOTPEmail } from "@/lib/mail";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const { db } = await getDb('cosmeticsdb');
        
        // Use lowercase email for consistency
        const userEmail = email.toLowerCase();

        // Use "User" (Prisma default PascalCase)
        const user = await db.collection("User").findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json({ 
                success: false, 
                message: "User not found with this email. Please ensure you are registered.",
                debugEmail: userEmail
            }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save new OTP in VerificationToken collection (PascalCase)
        await db.collection("VerificationToken").deleteMany({ identifier: userEmail });
        await db.collection("VerificationToken").insertOne({
            identifier: userEmail,
            token: otp,
            expires: expiresAt
        });

        // Send Email
        await sendOTPEmail(userEmail, otp);

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("FULL ERROR SENDING OTP:", error);
        return NextResponse.json({ success: false, message: "Failed to send OTP", error: error.message }, { status: 500 });
    }
}
