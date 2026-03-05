const { MongoClient, ObjectId } = require('mongodb');

async function testPlaceOrder() {
    const uri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/cosmeticsdb?directConnection=true&serverSelectionTimeoutMS=2000";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("cosmeticsdb");

        // Find a user and an address
        const user = await database.collection("User").findOne({});
        if (!user) return console.log("No user found");

        const address = await database.collection("Address").findOne({ userId: user._id.toString() });
        const addressId = address ? address._id.toString() : new ObjectId().toString();

        const orderData = {
            userId: user._id.toString(),
            total: 100,
            status: "ORDER_PLACED",
            paymentMethod: "COD",
            addressId,
            isPaid: false,
            isCouponUsed: false,
            coupon: "{}",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const orderItemsList = [
            { productId: "6798aebf04f4a38dfdc8ddba", quantity: 1, price: 50 },
            { productId: "6798aebf04f4a38dfdc8ddbc", quantity: 2, price: 25 }
        ];

        const ordersCollection = database.collection("Order");
        const orderItemsCollection = database.collection("OrderItem");

        console.log("Inserting order...");
        const orderResult = await ordersCollection.insertOne(orderData);
        const orderIdString = orderResult.insertedId.toString();

        console.log("Order ID:", orderIdString);

        const rawOrderItems = orderItemsList.map(item => ({
            ...item,
            orderId: orderIdString
        }));

        console.log("Inserting order items...");
        if (rawOrderItems.length > 0) {
            await orderItemsCollection.insertMany(rawOrderItems);
        }

        const newOrder = {
            ...orderData,
            id: orderIdString,
            orderItems: rawOrderItems
        };

        console.log("Success! newOrder:", newOrder);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

testPlaceOrder();
