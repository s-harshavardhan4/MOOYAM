import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;
console.log('DB URL prefix:', url?.substring(0, 60) + '...');

const client = new MongoClient(url);
try {
    await client.connect();
    const db = client.db('cosmeticsdb');
    const count = await db.collection('Product').countDocuments();
    console.log('✅ Connected! Product count:', count);
} catch (err) {
    console.error('❌ FAIL:', err.message);
    console.error('Code:', err.code);
    if (err.cause) console.error('Cause:', err.cause.message, err.cause.code);
} finally {
    await client.close();
}
