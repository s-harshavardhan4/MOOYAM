import express from 'express';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';

const router = express.Router();

// GET /api/user/wishlist
router.get('/wishlist', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await getDb();
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const savedItemsIds = user.savedItems || [];

        // Fetch product details for saved items
        let products = [];
        if (savedItemsIds.length > 0) {
            const validIds = savedItemsIds.filter(id => ObjectId.isValid(id));
            products = await db.collection('Product').find({
                _id: { $in: validIds.map(id => new ObjectId(id)) }
            }).toArray();
            products = products.map(p => ({ ...p, id: p._id.toString() }));
        }

        res.json({ success: true, savedItems: products, savedItemIds: savedItemsIds });
    } catch (error) {
        console.error("BACKEND_ERROR [GET /api/user/wishlist]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/user/wishlist - Toggle item
router.post('/wishlist', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required' });
        }

        const db = await getDb();
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        let currentSavedItems = user.savedItems || [];
        let isSaved = false;

        if (currentSavedItems.includes(productId)) {
            currentSavedItems = currentSavedItems.filter(id => id !== productId);
            isSaved = false;
        } else {
            currentSavedItems.push(productId);
            isSaved = true;
        }

        await db.collection('User').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { savedItems: currentSavedItems, updatedAt: new Date() } }
        );

        let productData = null;
        if (isSaved && ObjectId.isValid(productId)) {
            productData = await db.collection('Product').findOne({ _id: new ObjectId(productId) });
            if (productData) productData = { ...productData, id: productData._id.toString() };
        }

        res.json({
            success: true,
            message: isSaved ? 'Added to saved items' : 'Removed from saved items',
            isSaved,
            savedItemIds: currentSavedItems,
            product: productData
        });
    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/user/wishlist]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/user/review
router.post('/review', async (req, res) => {
    try {
        const { productId, rating, review, userId } = req.body;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!productId || !rating || !review) {
            return res.status(400).json({ success: false, message: 'Missing review data' });
        }

        const db = await getDb();
        const product = await db.collection('Product').findOne({ _id: new ObjectId(productId) });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const reviewDoc = { userId, rating: Number(rating), review, createdAt: new Date() };

        await db.collection('Product').updateOne(
            { _id: new ObjectId(productId) },
            { $push: { rating: reviewDoc } }
        );

        res.json({ success: true, message: 'Review added successfully' });
    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/user/review]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/user/profile
router.get('/profile', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const db = await getDb();
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) });

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                image: user.image,
                hasPassword: !!user.password,
                isAdmin: user.isAdmin || false,
            }
        });
    } catch (error) {
        console.error("BACKEND_ERROR [GET /api/user/profile]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/user/profile - Update Name
router.put('/profile', async (req, res) => {
    try {
        const { userId, name } = req.body;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

        const db = await getDb();
        await db.collection('User').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { name, updatedAt: new Date() } }
        );

        res.json({ success: true, message: 'Profile updated successfully', user: { name } });
    } catch (error) {
        console.error("BACKEND_ERROR [PUT /api/user/profile]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PATCH /api/user/profile - Update Password
router.patch('/profile', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both passwords are required' });
        }

        const db = await getDb();
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) });

        if (!user || !user.password) {
            return res.status(400).json({ success: false, message: 'User cannot update password via this method' });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection('User').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error("BACKEND_ERROR [PATCH /api/user/profile]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/user/set-password - Set password for OAuth users (no current password needed)
router.post('/set-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const db = await getDb();
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection('User').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        res.json({ success: true, message: 'Password set successfully' });
    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/user/set-password]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/user/profile
router.delete('/profile', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const db = await getDb();
        const user = await db.collection('User').findOne({ _id: new ObjectId(userId) });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.email === 'admin@mooyan.com') {
            return res.status(403).json({ success: false, message: 'Cannot delete demo admin account' });
        }

        await db.collection('User').deleteOne({ _id: new ObjectId(userId) });

        res.json({ success: true, message: 'Account deleted forever' });
    } catch (error) {
        console.error("BACKEND_ERROR [DELETE /api/user/profile]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
