import "dotenv/config";
import mongoose from "mongoose";

console.log("URI from env:", process.env.MONGODB_URI);

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Connection failed:", err.message);
        process.exit(1);
    }
}

test();
