const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("cosmeticsdb");
    
    console.log('--- Checking Documents ---');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    const products = await db.collection("Product").find({}).limit(1).toArray();
    console.log('Sample Product:', JSON.stringify(products[0], null, 2));

    const productCount = await db.collection("Product").countDocuments();
    console.log('Total Products:', productCount);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

main();
