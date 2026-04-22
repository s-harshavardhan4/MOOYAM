import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
});

const dbName = 'cosmeticsdb';
let _db = null;

export async function getDb() {
    if (!_db) {
        try {
            await mongoClient.connect();
            _db = mongoClient.db(dbName);
            console.log('✅ MongoDB Connected (Native Client)');
        } catch (error) {
            console.error('❌ MongoDB Connection Error:', error);
            throw error;
        }
    }
    return _db;
}

export { mongoClient };
