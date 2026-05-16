import mongoose from "mongoose";

async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined in .env file");
            return;
        }
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database is connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
};

export default connectDB;
