const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("cosmeticsdb");
    const users = await db.collection("User").find({}).toArray();
    console.log('Users in Local DB:');
    users.forEach(u => {
      console.log(`- Email: ${u.email}, Name: ${u.name}, HasPassword: ${!!u.password}`);
    });
  } catch (err) {
    console.error('Error checking DB:', err);
  } finally {
    await client.close();
  }
}

main();
