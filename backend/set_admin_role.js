import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://akhilayanampudiakhil_db_user:Saiakhil1026@mooyamcreams.eq8gwn3.mongodb.net/cosmeticsdb?retryWrites=true&w=majority&appName=mooyamcreams';

async function setAdminRole() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('cosmeticsdb');

    // Add role: 'admin' to all users with isAdmin: true
    const result = await db.collection('User').updateMany(
        { isAdmin: true },
        { $set: { role: 'admin' } }
    );
    console.log(`✅ Updated ${result.modifiedCount} admin user(s) with role: 'admin'`);

    // Verify
    const admins = await db.collection('User').find({ role: 'admin' }, { projection: { email: 1, role: 1, isAdmin: 1 } }).toArray();
    console.log('Admin users:', JSON.stringify(admins, null, 2));

    await client.close();
    process.exit(0);
}

setAdminRole().catch(e => { console.error('Error:', e.message); process.exit(1); });
