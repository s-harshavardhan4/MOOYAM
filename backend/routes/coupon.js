import express from 'express';

const router = express.Router();

const VALID_COUPONS = {
    'SAVE10': { code: 'SAVE10', discount: 10, description: '10% off your entire order' },
    'MOOYAM20': { code: 'MOOYAM20', discount: 20, description: '20% off holiday special' },
    'WELCOME5': { code: 'WELCOME5', discount: 5, description: '5% off for new customers' }
};

// GET /api/coupon
router.get('/', (req, res) => {
    try {
        const { code, userId } = req.query;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const normalizedCode = code.toUpperCase().trim();
        const coupon = VALID_COUPONS[normalizedCode];

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
        }

        res.json({ success: true, coupon });
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ success: false, message: 'Failed to validate coupon' });
    }
});

export default router;
