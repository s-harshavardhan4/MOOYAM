import { getDb } from "./lib/mongodb.js";

async function check() {
    try {
        const { db } = await getDb('cosmeticsdb');
        const collections = await db.listCollections().toArray();
        console.log("COLLECTIONS:", collections.map(c => c.name));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
