import express from 'express';
import { stripe } from '../../lib/stripe.js';

const router = express.Router();

// POST /api/checkout
router.post('/', async (req, res) => {
    try {
        const { items, total, addressId, paymentMethod, coupon, userId } = req.body;

        if (!userId || !items || !items.length) {
            return res.status(400).json({ success: false, message: 'Missing required checkout fields' });
        }

        const line_items = items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name || 'Product',
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders?success=true`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart?canceled=true`,
            metadata: {
                userId,
                addressId,
                items: JSON.stringify(items.map(i => ({ id: i.id || i.productId, quantity: i.quantity || 1 }))),
                coupon: JSON.stringify(coupon || {})
            }
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ success: false, message: 'Failed to initiate Stripe checkout' });
    }
});

export default router;
