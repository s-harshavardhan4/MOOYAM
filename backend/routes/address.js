import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';

const router = express.Router();

// GET /api/address
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await getDb();
        const addresses = await db.collection('Address').find({ userId }).toArray();

        res.json({ success: true, addresses: addresses.map(a => ({ ...a, id: a._id.toString() })) });
    } catch (error) {
        console.error("BACKEND_ERROR [GET /api/address]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/address
router.post('/', async (req, res) => {
    try {
        const { userId, name, email, street, city, state, zip, country, phone } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await getDb();
        const collection = db.collection('Address');

        const newAddress = {
            userId,
            name,
            email,
            street,
            city,
            state,
            zip,
            country,
            phone,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await collection.insertOne(newAddress);
        
        res.json({ 
            success: true, 
            message: 'Address added', 
            address: { ...newAddress, id: result.insertedId.toString() } 
        });

    } catch (error) {
        console.error("BACKEND_ERROR [POST /api/address]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/address/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, name, email, street, city, state, zip, country, phone } = req.body;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await getDb();
        const collection = db.collection('Address');

        const updateData = {
            name, email, street, city, state, zip, country, phone,
            updatedAt: new Date()
        };

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id), userId },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
        }

        res.json({ success: true, message: 'Address updated', address: { ...result, id: result._id.toString() } });

    } catch (error) {
        console.error("BACKEND_ERROR [PUT /api/address]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/address/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Usually sent in body or query

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const db = await getDb();
        const collection = db.collection('Address');

        const result = await collection.deleteOne({ _id: new ObjectId(id), userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Address not found or unauthorized' });
        }

        res.json({ success: true, message: 'Address deleted', id });

    } catch (error) {
        console.error("BACKEND_ERROR [DELETE /api/address]:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
