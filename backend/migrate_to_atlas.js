import { MongoClient } from 'mongodb';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/cosmeticsdb';
const ATLAS_URI = 'mongodb+srv://akhilayanampudiakhil_db_user:Saiakhil1026@mooyamcreams.eq8gwn3.mongodb.net/cosmeticsdb?retryWrites=true&w=majority&appName=mooyamcreams';
const DB_NAME = 'cosmeticsdb';

const atlasOptions = {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 30000,
};

async function migrate() {
    console.log('Connecting to local MongoDB...');
    const localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    const localDb = localClient.db(DB_NAME);
    console.log('Connected to local MongoDB ✅');

    console.log('Connecting to Atlas...');
    const atlasClient = new MongoClient(ATLAS_URI, atlasOptions);
    await atlasClient.connect();
    const atlasDb = atlasClient.db(DB_NAME);
    console.log('Connected to Atlas ✅\n');

    const collections = await localDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections: ${collections.map(c => c.name).join(', ')}\n`);

    for (const col of collections) {
        const name = col.name;
        const docs = await localDb.collection(name).find({}).toArray();

        if (docs.length === 0) {
            console.log(`⏭  ${name}: empty, skipping`);
            continue;
        }

        // Drop existing on Atlas to avoid duplicate key errors
        try { await atlasDb.collection(name).drop(); } catch (_) {}

        await atlasDb.collection(name).insertMany(docs);
        console.log(`✅ ${name}: migrated ${docs.length} documents`);
    }

    await localClient.close();
    await atlasClient.close();
    console.log('\n🎉 Migration complete! All data is now on Atlas.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('❌ Migration failed:', err.message);
    if (err.message.includes('SSL') || err.message.includes('TLS')) {
        console.error('💡 SSL error — check Atlas Network Access allows your IP (0.0.0.0/0)');
    }
    process.exit(1);
});
