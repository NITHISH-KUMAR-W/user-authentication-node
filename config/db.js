const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const MONGO_URI =
    process.env.MONGO_URI ||
    `mongodb+srv://nithishkumarw:Smith.w%4007@user-authentication-nod.chjyo.mongodb.net/`;

let db;
let collection;

const connectDB = async () => {
    try {
        // Connect using Mongoose
        const mongooseConnection = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected with Mongoose: ${mongooseConnection.connection.host}`);

        // Connect using MongoClient
        const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
        await client.connect();
        console.log("✅ MongoDB Connected Successfully with MongoClient");

        // Get Database & Collection
        db = client.db("user-authentication-node-guvi");
        collection = db.collection("users");

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

// Export the connection and collection
module.exports = { connectDB, db, collection };
