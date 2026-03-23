import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: "Email and OTP are required" }, { status: 400 });
        }

        const { db } = await getDb('cosmeticsdb');
        const userEmail = email.toLowerCase();

        // Find the most recent OTP for this email in VerificationToken
        const record = await db.collection("VerificationToken").findOne({ 
            identifier: userEmail, 
            token: otp 
        });

        if (!record) {
            return NextResponse.json({ success: false, message: "Invalid OTP code" }, { status: 400 });
        }

        if (new Date() > new Date(record.expires)) {
            // Cleanup expired OTP
            await db.collection("VerificationToken").deleteOne({ _id: record._id });
            return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 });
        }

        // Success! Don't delete yet, reset-password will delete it.
        // Or delete now and return a temporary token? 
        // For simplicity, we'll delete it here and the user is verified.

        return NextResponse.json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ success: false, message: "Failed to verify OTP", error: error.message }, { status: 500 });
    }
}
