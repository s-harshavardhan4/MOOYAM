import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db"

function sanitizeReview(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
        }

        const body = await req.json()
        const { productId, rating, review } = body

        if (!productId || rating === undefined || !review) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 })
        }

        const userId = session.user.id

        const existingReview = await prisma.rating.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        })

        if (existingReview) {
            return new Response(JSON.stringify({ message: "You have already reviewed this product." }), { status: 409 })
        }

        const sanitizedReview = sanitizeReview(review);

        const newReview = await prisma.rating.create({
            data: {
                rating: Number(rating),
                review: sanitizedReview,
                userId,
                productId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        })

        return new Response(JSON.stringify(newReview), { status: 201 })
    } catch (error) {
        console.error("API Error in Add Review:", error)
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 })
    }
}
