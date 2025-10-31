import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "nodejs";

// ======================
// 🔹 MongoDB Connection
// ======================
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "csbs_sync"; // 🔹 Replace with your DB name (example: "csbssync")

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    if (!MONGODB_URI) throw new Error("⚠️ MONGODB_URI not found in env.");
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME, // ✅ specify your DB name here
    });
    isConnected = true;
    console.log(`✅ MongoDB connected to database: ${DB_NAME}`);
  }
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
// 🔹 DELETE → Delete Material by ID
// ======================
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing material ID" },
        { status: 400 }
      );
    }

    await Material.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete material" },
      { status: 500 }
    );
  }
}
