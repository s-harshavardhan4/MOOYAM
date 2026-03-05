import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.create({
            data: {
                name: 'Test Create',
                email: 'testcreate@test.com',
                password: 'password'
            }
        });
        console.log("Success:", user);
    } catch (error) {
        console.error("Prisma Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
