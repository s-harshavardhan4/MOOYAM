import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const { db } = await getDb('cosmeticsdb');
        const userEmail = email.toLowerCase();

        // 1. One last check of the OTP in VerificationToken
        const record = await db.collection("VerificationToken").findOne({ 
            identifier: userEmail, 
            token: otp 
        });

        if (!record) {
            return NextResponse.json({ success: false, message: "Unauthorized. Please verify OTP again." }, { status: 401 });
        }

        // 2. Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Update User
        const result = await db.collection("User").updateOne(
            { email: userEmail },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, message: "User not found during password update" }, { status: 404 });
        }

        // 4. Cleanup OTP
        await db.collection("VerificationToken").deleteOne({ _id: record._id });

        return NextResponse.json({ success: true, message: "Password reset successfully" });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ success: false, message: "Failed to reset password", error: error.message }, { status: 500 });
    }
}
