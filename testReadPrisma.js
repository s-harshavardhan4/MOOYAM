import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                address: true,
                orderItems: {
                    include: { product: true }
                }
            }
        });
        console.log("Success findMany orders count:", orders.length);
    } catch (error) {
        console.error("Prisma Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
