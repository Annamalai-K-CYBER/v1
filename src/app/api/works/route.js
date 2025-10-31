import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ImageKit from "imagekit";

export const runtime = "nodejs"; // ✅ Node runtime (NOT Edge)

// ======================
// 🔹 MongoDB Connection
// ======================
const MONGODB_URI = process.env.MONGODB_URI;
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!MONGODB_URI) throw new Error("❌ MONGODB_URI not found");

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "csbsdb",
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

// ======================
// 🔹 Mongoose Schema
// ======================
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

// Prevent model overwrite in hot reload
const Work = mongoose.models.Work || mongoose.model("Work", WorkSchema);

// ======================
// 🔹 ImageKit Setup
// ======================
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ======================
// 🔹 GET: All Works
// ======================
export async function GET() {
  try {
    await connectDB();
    const works = await Work.find().sort({ createdAt: -1 });
    return NextResponse.json(works, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/works Error:", error);
    return NextResponse.json(
      { message: "Error fetching works", error: error.message },
      { status: 500 }
    );
  }
}

// ======================
// 🔹 POST: Create Work
// ======================
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { subject, work, deadline, addedBy, fileBase64, status } = body;

    if (!subject || !work || !deadline) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let fileUrl = "";
    if (fileBase64) {
      const upload = await imagekit.upload({
        file: fileBase64,
        fileName: `${subject}-${Date.now()}.jpg`,
        folder: "/works",
      });
      fileUrl = upload.url;
    }

    const newWork = await Work.create({
      subject,
      work,
      deadline,
      fileUrl,
      addedBy,
      status: status || [],
    });

    return NextResponse.json(newWork, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/works Error:", error);
    return NextResponse.json(
      { message: "Error creating work", error: error.message },
      { status: 500 }
    );
  }
}
    