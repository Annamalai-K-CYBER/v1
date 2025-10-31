import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
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

const Material = mongoose.models.Material || mongoose.model("Material", materialSchema);

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Material.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete" },
      { status: 500 }
    );
  }
}
