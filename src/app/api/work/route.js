import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "nodejs";

// ✅ Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "csbsdb" });
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

// ✅ GET All Works
export async function GET() {
  try {
    await connectDB();
    const works = await Work.find().sort({ createdAt: -1 });
    return NextResponse.json(works);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
