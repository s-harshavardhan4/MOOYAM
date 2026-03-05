const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            console.log('No user found');
            return;
        }
        const currentItems = user.savedItems || [];
        currentItems.push("new_id_" + Math.random().toString(36).substring(7));

        try {
            const result = await prisma.$runCommandRaw({
                update: "User",
                updates: [
                    {
                        q: { _id: { $oid: user.id } },
                        u: { $set: { savedItems: currentItems } }
                    }
                ]
            });
            console.log('Success with runCommandRaw!');
        } catch (e) {
            console.log('Error with runCommandRaw:', e.message);
        }

    } finally {
        await prisma.$disconnect();
    }
}
test();
