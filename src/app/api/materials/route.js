import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic"; // ensures it works on Vercel edge
export const runtime = "nodejs";

const MONGODB_URI = process.env.MONGODB_URI;

// ========================
// 🔹 MongoDB Connection
// ========================
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
  }
}

// ========================
// 🔹 Schema & Model
// ========================
const materialSchema = new mongoose.Schema(
  {
    matname: String,
    subject: String,
    link: String,
    name: String, // uploader name
    format: String,
    uploadDate: String,
  },
  { collection: "materials" }
);

const Material =
  mongoose.models.Material || mongoose.model("Material", materialSchema);

// ========================
// 🔹 GET: Fetch all materials
// ========================
export async function GET() {
  try {
    await connectDB();
    const materials = await Material.find().sort({ uploadDate: -1 });

    return NextResponse.json(materials, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching materials:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching materials" },
      { status: 500 }
    );
  }
}
