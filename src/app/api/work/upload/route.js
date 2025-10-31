import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ImageKit from "imagekit";

// ✅ Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, { dbName: "worksdb" });
  console.log("✅ MongoDB connected");
}

// ✅ Schema
const StatusSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  state: { type: String, default: "not yet started" },
});

const WorkSchema = new mongoose.Schema(
  {
    subject: String,
    work: String,
    deadline: String,
    fileUrl: String,
    addedBy: String,
    status: [StatusSchema],
  },
  { timestamps: true }
);

const Work = mongoose.models.Work || mongoose.model("Work", WorkSchema);

// ✅ ImageKit setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ✅ POST: upload image to ImageKit
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64,
      fileName: file.name || `work-${Date.now()}`,
      folder: "/works",
    });

    console.log("✅ Uploaded to ImageKit:", uploadResponse.url);

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: err.message },
      { status: 500 }
    );
  }
}

// ✅ GET test
export async function GET() {
  return NextResponse.json({ message: "✅ Upload API working fine" });
}
