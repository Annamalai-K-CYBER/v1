import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ✅ MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("⚠️ MONGODB_URI not set in .env");
  const db = await mongoose.connect(uri);
  isConnected = db.connections[0].readyState;
  console.log("✅ MongoDB connected");
}

// ✅ Schema & Model
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

export const runtime = "nodejs";

// ✅ GET all works
export async function GET() {
  try {
    await connectDB();
    const works = await Work.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, works }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /api/work error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// ✅ POST new work
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newWork = await Work.create(body);
    return NextResponse.json({ success: true, work: newWork }, { status: 201 });
  } catch (err) {
    console.error("❌ POST /api/work error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
