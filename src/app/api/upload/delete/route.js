import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(MONGODB_URI, { dbName: "csbs_sync" }); // ✅ include DB name
    isConnected = true;
    console.log("✅ MongoDB connected (delete route)");
  }
}

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

export async function POST(req) {
  try {
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "No ID provided" },
        { status: 400 }
      );
    }

    const deleted = await Material.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Material not found" },
        { status: 404 }
      );
    }

    console.log("🗑 Material deleted:", id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete" },
      { status: 500 }
    );
  }
}
