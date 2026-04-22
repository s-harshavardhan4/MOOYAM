import express from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';
import { sendOTPEmail } from '../lib/mail.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userEmail = email.toLowerCase();
        
        // Use Native Driver for everything to avoid SSL/TLS issues
        const db = await getDb();
        const existingUser = await db.collection('User').findOne({ email: userEmail });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUserDoc = {
            name,
            email: userEmail,
            password: hashedPassword,
            isAdmin: userEmail === process.env.ADMIN_EMAIL,
            createdAt: new Date(),
            updatedAt: new Date(),
            emailVerified: null,
            image: null,
            resetOtp: null,
            resetOtpExpiry: null,
            cart: "[]"
        };

        const result = await db.collection('User').insertOne(newUserDoc);

        res.status(201).json({ 
            success: true, 
            message: "Account created successfully", 
            user: { id: result.insertedId, name, email: userEmail } 
        });
    } catch (error) {
        console.error("BACKEND ERROR REGISTERING USER:", error);
        res.status(500).json({ success: false, message: "Failed to create account" });
    }
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const userEmail = email.toLowerCase();
        const db = await getDb();
        const user = await db.collection('User').findOne({ email: userEmail });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const tokenCollection = db.collection('VerificationToken');

        await tokenCollection.deleteMany({ identifier: userEmail });
        await tokenCollection.insertOne({
            identifier: userEmail,
            token: otp,
            expires: expiresAt
        });

        await sendOTPEmail(userEmail, otp);
        
        console.log(`[BACKEND-DEV] OTP for ${userEmail}: ${otp}`);
        
        res.json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/auth/send-otp]:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

        const userEmail = email.toLowerCase();
        const db = await getDb();
        const record = await db.collection("VerificationToken").findOne({ identifier: userEmail, token: otp });

        if (!record) return res.status(400).json({ success: false, message: "Invalid OTP code" });

        if (new Date() > new Date(record.expires)) {
            await db.collection("VerificationToken").deleteOne({ _id: record._id });
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/auth/verify-otp]:", error);
        res.status(500).json({ success: false, message: "Failed to verify OTP" });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: "All fields are required" });

        if (newPassword.length < 6) return res.status(400).json({ success: false, message: "Password too short" });

        const userEmail = email.toLowerCase();
        const db = await getDb();
        const record = await db.collection("VerificationToken").findOne({ identifier: userEmail, token: otp });

        if (!record) return res.status(401).json({ success: false, message: "Unauthorized. Verify OTP again." });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection("User").updateOne(
            { email: userEmail },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        await db.collection("VerificationToken").deleteOne({ _id: record._id });
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/auth/reset-password]:", error);
        res.status(500).json({ success: false, message: "Failed to reset password" });
    }
});

export default router;
