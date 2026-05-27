import { MongoClient } from 'mongodb';

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  throw new Error('Invalid/Missing environment variable: "DATABASE_URL"');
}

const uri = process.env.DATABASE_URL || '';
const options = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Helper to get connected db instance
export async function getDb(dbName = 'cosmeticsdb') {
  const client = await clientPromise;
  return { client, db: client.db(dbName) };
}

export default clientPromise;
