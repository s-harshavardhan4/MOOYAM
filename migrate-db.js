const { MongoClient } = require('mongodb');

async function migrate() {
    const client = new MongoClient('mongodb://127.0.0.1:27017/cosmeticsdb');
    try {
        await client.connect();
        const db = client.db('cosmeticsdb');
        
        console.log("Starting migration...");

        // 1. Users
        const users = await db.collection('users').find().toArray();
        for (const u of users) {
            const { _id, ...userData } = u;
            await db.collection('User').updateOne(
                { email: u.email },
                { $set: userData },
                { upsert: true }
            );
            console.log(`Migrated user: ${u.email}`);
        }

        // 2. Accounts
        const accounts = await db.collection('accounts').find().toArray();
        for (const a of accounts) {
            const { _id, ...accountData } = a;
            await db.collection('Account').updateOne(
                { providerAccountId: a.providerAccountId },
                { $set: accountData },
                { upsert: true }
            );
            console.log(`Migrated account for provider: ${a.provider}`);
        }

        // 3. Drop lowercase collections
        if (users.length > 0) {
            await db.collection('users').drop();
            console.log("Dropped 'users' collection");
        }
        if (accounts.length > 0) {
            await db.collection('accounts').drop();
            console.log("Dropped 'accounts' collection");
        }

        console.log("Migration successful!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

migrate();
