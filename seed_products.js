const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productDummyData = [
    {
        name: "Anti Acne Set",
        description: "The complete 3-step routine for clear skin. Includes a purifying cleanser, targeted treatment serum, and soothing moisturizer to tackle blemishes head-on.",
        mrp: 35,
        price: 25,
        images: [
            '/products/anti_acne_set(1).jpeg',
            '/products/anti_acne_set.png'
        ],
        category: "SkinCare",
        subCategory: "Creams",
        inStock: true,
        quantity: 10,
    },
    {
        name: "Advance snail cleanser",
        description: "The complete 3-step routine for clear skin. Includes a purifying cleanser, targeted treatment serum, and soothing moisturizer to tackle blemishes head-on.",
        mrp: 75,
        price: 60,
        images: [
            '/products/advance_snail_claner(1).jpeg',
            '/products/advance_snail_claner(2).jpeg'
        ],
        category: "SkinCare",
        subCategory: "Creams",
        inStock: true,
        quantity: 10,
    },
    {
        name: "Advance snail 92",
        description: "A potent, fast-acting serum packed with active ingredients that dive deep into pores to clear congestion and visibly reduce redness overnight.",
        mrp: 45,
        price: 32,
        images: [
            '/products/advance_sail92(1).jpeg',
            '/products/advance_sail92(2).jpeg'
        ],
        category: "SkinCare",
        subCategory: "Creams",
        inStock: true,
        quantity: 10,
    },
    {
        name: "Mooyam Yuja Niacin",
        description: "Brighten dark spots and even out skin tone with the power of Yuja extract and Niacinamide. This lightweight formula restores a radiant, healthy glow.",
        mrp: 50,
        price: 40,
        images: [
            '/products/yuja_niacin(1).jpeg',
            '/products/yuja_niacin(2).jpeg'
        ],
        category: "SkinCare",
        subCategory: "Creams",
        inStock: true,
        quantity: 10,
    },
    {
        name: "Snail 92 All In One Cream",
        description: "A lightweight cream enriched with 92% snail mucin to deeply nourish, repair, and plump exactly what your skin needs for a youthful glow. Soothes irritated skin.",
        mrp: 35,
        price: 25,
        images: [
            '/products/sail92_all_in_one_cream(1).png',
            '/products/sail92_all_in_one_cream(2).png',
            '/products/sail92_all_in_one_cream(3).jpeg'
        ],
        category: "SkinCare",
        subCategory: "Creams",
        inStock: true,
        quantity: 10,
    },
    {
        name: "Acne Serum",
        description: "A serum enriched with 92% snail mucin to deeply nourish, repair, and plump exactly what your skin needs for a youthful glow. Soothes irritated skin.",
        mrp: 55,
        price: 49,
        images: [
            '/products/acne_serum(1).jpeg',
            '/products/acne_serum(2).jpeg'
        ],
        category: "SkinCare",
        subCategory: "Serums",
        inStock: true,
        quantity: 10,
    },
    {
        name: "Mooyam set",
        description: "The complete 3-step routine for clear skin. Includes a purifying cleanser, targeted treatment serum, and soothing moisturizer to tackle blemishes head-on.",
        mrp: 40,
        price: 32,
        images: ['/products/MOOYAM.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Creams",
        quantity: 10,
    },
    {
        name: "Pink Collagen Capsule Cream",
        description: "A lightweight cream enriched with 92% snail mucin to deeply nourish, repair, and plump exactly what your skin needs for a youthful glow. Soothes irritated skin.",
        mrp: 30,
        price: 25,
        images: ['/products/pink_collagen_capsule_cream(1).jpeg',
            '/products/pink_collagen_capsule_cream(2).jpeg',
            '/products/pink_collagen_capsule_cream(3).jpeg',
            '/products/pink_collagen_capsule_cream(4).jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Creams",
        quantity: 10,
    },
    {
        name: "Radiant Whitening & Repair Serum",
        description: "The complete 3-step routine for clear skin. Includes a purifying cleanser, targeted treatment serum, and soothing moisturizer to tackle blemishes head-on.",
        mrp: 65,
        price: 52,
        images: ['/products/Radiant_whitening_&_Repair_serum(1).jpeg',
            '/products/Radiant_whitening_&_Repair_serum(2).jpeg',
        ],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        quantity: 10,
    },
    {
        name: "Professional Facial Serum",
        description: "A potent, fast-acting serum packed with active ingredients that dive deep into pores to clear congestion and visibly reduce redness overnight.",
        mrp: 45,
        price: 36,
        images: ['/products/professional_Facial_Serum.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        quantity: 10,
    },
    {
        name: "Hydrating Repair Facial Serum",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 55,
        price: 45,
        images: ['/products/Hydrating_Repair_Facial_Serum(1).jpeg',
            '/products/Hydrating_Repair_Facial_Serum(2).jpeg'
        ],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        quantity: 10,
    },
    {
        name: "Anti Acne Facial Serum",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 35,
        price: 25,
        images: ['/products/Anti_Acne_Facial_Serum.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        quantity: 10,
    },
    {
        name: "Vitamin C Facial Cream",
        description: "This lightweight cream absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 28,
        price: 22,
        images: ['/products/VitaminC_Facial_Cream(1).jpeg',
            '/products/VitaminC_Facial_Cream(2).jpeg',
            '/products/VitaminC_Facial_Cream(3).jpeg'
        ],
        inStock: true,
        category: "SkinCare",
        subCategory: "Creams",
        quantity: 10,
    },
    {
        name: "Vitamin C Facial Serum",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 22,
        price: 18,
        images: ['/products/VitaminC_Serum(1).jpeg',
            '/products/VitaminC_Serum(2).jpeg'
        ],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        quantity: 10,
    },
    {
        name: "Bear Fruto Serum",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 85,
        price: 70,
        images: ['/products/Bear_Fruto_Serum.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        quantity: 10,
    },
    {
        name: "Radiant_whitening_&_Repair_Cream",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 38,
        price: 32,
        images: ['/products/Radiant_whitening_&_Repair_Cream(1).jpeg',
            '/products/Radiant_whitening_&_Repair_Cream(2).jpeg'
        ],
        inStock: true,
        category: "SkinCare",
        subCategory: "Creams",
        quantity: 10,
    },
    {
        name: "Peptide Lip Balm",
        description: "Hydrating lip treatment formulated with peptides and shea butter for visibly plumped and soft lips.",
        mrp: 20,
        price: 16,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800'],
        inStock: true,
        category: "Makeup",
        quantity: 10,
    }
];

async function main() {
    console.log(`Start seeding ${productDummyData.length} products ...`);

    // Clear existing products first to avoid duplicates
    await prisma.product.deleteMany({});
    console.log('✅ Cleared existing products from database.');

    for (const p of productDummyData) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                description: p.description,
                mrp: p.mrp,
                price: p.price,
                images: p.images,
                category: p.category,
                subCategory: p.subCategory,
                inStock: p.inStock,
                quantity: p.quantity,
            }
        });
        console.log(`Created product with id: ${product.id}`);
    }
    console.log('✅ Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
