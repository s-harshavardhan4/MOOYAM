import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../lib/db.js';

const router = express.Router();

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const products = await db.collection('Product')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Normalize _id → id for the frontend
        const normalized = products.map(p => ({ ...p, id: p._id.toString() }));
        res.json({ success: true, products: normalized });
    } catch (error) {
        console.error('BACKEND_ERROR [GET /api/products]:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
});

// PUT /api/products - Update a product
router.put('/', async (req, res) => {
    try {
        const { id, price, mrp, quantity, inStock } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Missing product ID' });
        }

        const updateFields = {};
        if (price !== undefined) updateFields.price = parseFloat(price);
        if (mrp !== undefined) updateFields.mrp = parseFloat(mrp);
        if (quantity !== undefined) updateFields.quantity = parseInt(quantity, 10);
        if (inStock !== undefined) updateFields.inStock = Boolean(inStock);
        updateFields.updatedAt = new Date();
        
        const db = await getDb();
        const collection = db.collection('Product');

        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        console.error('BACKEND_ERROR [PUT /api/products]:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
    try {
        const { name, description, mrp, price, category, subCategory, images, quantity } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const newProduct = {
            name,
            description,
            mrp: parseFloat(mrp) || 0,
            price: parseFloat(price),
            category,
            subCategory: subCategory || null,
            images: images || [],
            quantity: parseInt(quantity, 10) || 0,
            inStock: (parseInt(quantity, 10) || 0) > 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const db = await getDb();
        const collection = db.collection('Product');

        const result = await collection.insertOne(newProduct);

        res.status(201).json({ 
            success: true, 
            message: 'Product created successfully', 
            productId: result.insertedId.toString() 
        });

    } catch (error) {
        console.error('BACKEND_ERROR [POST /api/products]:', error);
        res.status(500).json({ success: false, message: 'Failed to create product' });
    }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: 'Missing product ID' });

        const db = await getDb();
        const result = await db.collection('Product').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('BACKEND_ERROR [DELETE /api/products/:id]:', error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
});

export default router;
