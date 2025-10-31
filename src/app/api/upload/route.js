import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ImageKit from "imagekit";

export const runtime = "nodejs";
const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(MONGODB_URI);
  isConnected = true;
}

const materialSchema = new mongoose.Schema(
  {
    matname: String,
    subject: String,
    link: String,
    name: String,
    format: String,
    uploadDate: String,
  },
  { collection: "materials" }
);
const Material =
  mongoose.models.Material || mongoose.model("Material", materialSchema);

// 🔹 ImageKit Setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC,
  privateKey: process.env.IMAGEKIT_PRIVATE,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const file = formData.get("file");
    const materialName = formData.get("materialName");
    const subject = formData.get("subject");
    const username = formData.get("username");
    const uploadDate = formData.get("uploadDate");

    if (!file || !materialName || !subject)
      return NextResponse.json({ success: false, message: "Missing fields" });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });

    const newMaterial = new Material({
      matname: materialName,
      subject,
      name: username,
      link: uploadRes.url,
      format: file.name.split(".").pop(),
      uploadDate,
    });

    await newMaterial.save();

    return NextResponse.json({
      success: true,
      message: "Material uploaded successfully",
      url: uploadRes.url,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: err.message },
      { status: 500 }
    );
  }
}
