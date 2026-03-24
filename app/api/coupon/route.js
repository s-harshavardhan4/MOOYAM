import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// A mock database of valid coupons for demonstration.
// In a real application, this would fetch from the MongoDB 'Coupon' collection.
const VALID_COUPONS = {
    'SAVE10': { code: 'SAVE10', discount: 10, description: '10% off your entire order' },
    'MOOYAM20': { code: 'MOOYAM20', discount: 20, description: '20% off holiday special' },
    'WELCOME5': { code: 'WELCOME5', discount: 5, description: '5% off for new customers' }
};

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
        }

        const normalizedCode = code.toUpperCase().trim();
        const coupon = VALID_COUPONS[normalizedCode];

        if (!coupon) {
            return NextResponse.json({ success: false, message: 'Invalid or expired coupon code' }, { status: 404 });
        }

        return NextResponse.json({ success: true, coupon });
    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ success: false, message: 'Failed to validate coupon' }, { status: 500 });
    }
}
