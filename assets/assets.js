// import gs_logo from "./gs_logo.jpg"
import happy_store from "./happy_store.webp"
// import upload_area from "./upload_area.svg"
// import hero_model_img from "./hero_model_img.png"
// import hero_product_img1 from "./hero_product_img1.png"
// import hero_product_img2 from "./hero_product_img2.png"
// import product_img1 from "./product_img1.png"
// import product_img2 from "./product_img2.png"
// import product_img3 from "./product_img3.png"
// import product_img4 from "./product_img4.png"
// import product_img5 from "./product_img5.png"
// import product_img6 from "./product_img6.png"
// import product_img7 from "./product_img7.png"
// import product_img8 from "./product_img8.png"
// import product_img9 from "./product_img9.png"
// import product_img10 from "./product_img10.png"
// import product_img11 from "./product_img11.png"
// import product_img12 from "./product_img12.png"
// import p_saree_1 from "./p_saree_1.png"
// import p_blanket_1 from "./p_blanket_1.png"
// import p_kurti_1 from "./p_kurti_1.png"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg"
import profile_pic2 from "./profile_pic2.jpg"
import profile_pic3 from "./profile_pic3.jpg"

// --- Fallbacks for Missing Local Assets ---
const gs_logo = happy_store;
const upload_area = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>";
const hero_model_img = "/products/MOOYAM.jpeg";
const p_kurti_1 = happy_store;
const p_blanket_1 = happy_store;
const p_saree_1 = happy_store;
const product_img1 = happy_store;
const product_img2 = happy_store;
const product_img3 = happy_store;
const product_img4 = happy_store;
const product_img5 = happy_store;
const product_img6 = happy_store;
const product_img7 = happy_store;
const product_img8 = happy_store;
const product_img9 = happy_store;
const product_img10 = happy_store;
const product_img11 = happy_store;
const product_img12 = happy_store;
// ------------------------------------------

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1: p_kurti_1,
    hero_product_img2: p_blanket_1,
    gs_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,
    p_saree_1, p_blanket_1, p_kurti_1
}

export const categories = ["SkinCare", "HairCare", "Makeup"];

export const dummyRatingsData = [
    { id: "rat_1", rating: 4.8, review: "Absolutely stunning serum! My skin feels incredibly hydrated and glowing.", user: { name: 'Anjali Rao', image: profile_pic1 }, productId: "prod_1", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Radiance Vitamin C Serum', category: 'SkinCare', id: 'prod_1' } },
    { id: "rat_2", rating: 5.0, review: "Very nourishing hair mask. Perfect for dry ends.", user: { name: 'Priya Sharma', image: profile_pic2 }, productId: "prod_2", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Argan Oil Deep Repair Mask', category: 'HairCare', id: 'prod_2' } },
    { id: "rat_3", rating: 4.5, review: "Beautiful shade and lasts all day. Very comfortable formula.", user: { name: 'Sneha Gupta', image: profile_pic3 }, productId: "prod_3", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)', product: { name: 'Velvet Matte Lipstick', category: 'Makeup', id: 'prod_3' } },
]

export const productDummyData = [
    {
        id: "prod_mooyam_1",
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
        subCategory: "Creams",
        inStock: true,
        rating: dummyRatingsData,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: "prod_mooyam_2",
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
        subCategory: "Creams",
        inStock: true,
        rating: dummyRatingsData,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: "prod_mooyam_3",
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
        subCategory: "Creams",
        inStock: true,
        rating: dummyRatingsData,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: "prod_mooyam_4",
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
        subCategory: "Creams",
        inStock: true,
        rating: dummyRatingsData,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: "prod_mooyam_5",
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
        subCategory: "Creams",
        inStock: true,
        rating: dummyRatingsData,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
    },
    {
        id: "prod_mooyam_6",
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
        subCategory: "Serums",
        inStock: true,
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_7",
        name: "Mooyam set",
        description: "The complete 3-step routine for clear skin. Includes a purifying cleanser, targeted treatment serum, and soothing moisturizer to tackle blemishes head-on.",
        mrp: 40,
        price: 32,
        images: ['/products/MOOYAM.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Creams",
        subCategory: "Creams",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 28 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_8",
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
        subCategory: "Creams",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 27 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_9",
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
        subCategory: "Serums",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 26 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_10",
        name: "Professional Facial Serum",
        description: "A potent, fast-acting serum packed with active ingredients that dive deep into pores to clear congestion and visibly reduce redness overnight.",
        mrp: 45,
        price: 36,
        images: ['/products/professional_Facial_Serum.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        subCategory: "Serums",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_11",
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
        subCategory: "Serums",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_12",
        name: "Anti Acne Facial Serum",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 35,
        price: 25,
        images: ['/products/Anti_Acne_Facial_Serum.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        subCategory: "Serums",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 24 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_13",
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
        subCategory: "Creams",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 23 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_14",
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
        subCategory: "Serums",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 22 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_15",
        name: "Bear Fruto Serum",
        description: "This lightweight serum absorbs quickly to deliver a potent dose of active ingredients deep into the skin. Formulated to target dullness and uneven texture, it helps restore a smooth, radiant complexion. Perfect for daily use under moisturizer or makeup.",
        mrp: 85,
        price: 70,
        images: ['/products/Bear_Fruto_Serum.jpeg'],
        inStock: true,
        category: "SkinCare",
        subCategory: "Serums",
        subCategory: "Serums",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 21 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_mooyam_16",
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
        subCategory: "Creams",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 20 2025 14:51:25 GMT+0530 (India Standard Time)',
    },
    {
        id: "prod_12",
        name: "Peptide Lip Balm",
        description: "Hydrating lip treatment formulated with peptides and shea butter for visibly plumped and soft lips.",
        mrp: 20,
        price: 16,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800'],
        inStock: true,
        category: "Makeup",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
        updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
    }
];

export const ourSpecsData = [
    { title: "Free Shipping", description: "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.", icon: SendIcon, accent: '#05DF72' },
    { title: "7 Days easy Return", description: "Change your mind? No worries. Return any item within 7 days.", icon: ClockFadingIcon, accent: '#FF8904' },
    { title: "24/7 Customer Support", description: "We're here for you. Get expert help with our customer support.", icon: HeadsetIcon, accent: '#A684FF' }
]

export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "John Doe",
    email: "johndoe@example.com",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "USA",
    phone: "1234567890",
    createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0530 (India Standard Time)',
}

export const couponDummyData = [
    { code: "NEW20", description: "20% Off for New Users", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "NEW10", description: "10% Off for New Users", discount: 10, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "OFF20", description: "20% Off for All Users", discount: 20, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "OFF10", description: "10% Off for All Users", discount: 10, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "PLUS10", description: "20% Off for Members", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "GreatStack",
    email: "greatstack@example.com",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: dummyRatingsData[2],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0], },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1], }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3], },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4], }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const storesDummyData = [
    {
        id: "cmemkb98v0001tat8r1hiyxhn",
        userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "Lumière Aesthetics",
        description: "Lumière is a premium luxury skincare marketplace where you can discover the finest beauty regimens tailored to your skin type.",
        username: "lumiereaesthetics",
        address: "123 Beverly Blvd Los Angeles, CA 90048 USA",
        status: "approved",
        isActive: true,
        logo: gs_logo,
        email: "lumiere@example.com",
        contact: "+0 1234567890",
        createdAt: "2025-08-22T08:22:16.189Z",
        updatedAt: "2025-08-22T08:22:44.273Z",
        user: dummyUserData,
    },
    {
        id: "cmemkqnzm000htat8u7n8cpte",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        name: "Lumière Organics",
        description: "At Lumière Organics, we believe shopping should be clean, smart, and sustainable. Whether you're hunting for organic cleansers, top-notch serums, or botanical balms — we've got it all under one digital roof.",
        username: "lumiereorganics",
        address: "3rd Floor, Beauty Lab , New Building, 123 street , c sector , NY, US",
        status: "approved",
        isActive: true,
        logo: happy_store,
        email: "lumiereorganics@example.com",
        contact: "+0 123456789",
        createdAt: "2025-08-22T08:34:15.155Z",
        updatedAt: "2025-08-22T08:34:47.162Z",
        user: dummyUserData,
    }
]

export const dummyAdminDashboardData = {
    "orders": 6,
    "stores": 2,
    "products": 12,
    "revenue": "959.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "ratings": dummyRatingsData,
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}