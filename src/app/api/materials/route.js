import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "nodejs";

// ======================
// 🔹 MongoDB Connection
// ======================
const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!MONGODB_URI) throw new Error("⚠️ MONGODB_URI not found in env.");

  // ✅ Explicitly specify your database name
  await mongoose.connect(MONGODB_URI, { dbName: "csbs_portal" });
  isConnected = true;
  console.log("✅ MongoDB Connected → csbs_portal (materials route)");
}

// ======================
// 🔹 Mongoose Schema
// ======================
const materialSchema = new mongoose.Schema(
  {
    matname: String,
    subject: String,
    name: String,
    link: String,
    uploadDate: Date,
    format: String,
  },
  { collection: "materials" }
);

const Material =
  mongoose.models.Material || mongoose.model("Material", materialSchema);

// ======================
// 🔹 GET → All Materials
// ======================
export async function GET() {
  try {
    await connectDB();

    const materials = await Material.find().sort({ uploadDate: -1 });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("❌ Error fetching materials:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}
