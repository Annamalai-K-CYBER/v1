import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(MONGODB_URI, { dbName: "workdb" });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};
