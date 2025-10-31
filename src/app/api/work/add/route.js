import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ImageKit from "imagekit";

export const runtime = "nodejs";

// ✅ DB Connection
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

// ✅ ImageKit Setup
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ✅ POST — Create Work
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { subject, work, deadline, addedBy, fileBase64, status } = body;

    if (!subject || !work || !deadline)
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });

    let fileUrl = "";
    if (fileBase64) {
      const uploaded = await imagekit.upload({
        file: fileBase64,
        fileName: `${subject}-${Date.now()}.jpg`,
        folder: "/works",
      });
      fileUrl = uploaded.url;
    }

    const newWork = await Work.create({
      subject,
      work,
      deadline,
      addedBy,
      fileUrl,
      status: status || [],
    });

    return NextResponse.json({ message: "Work added", work: newWork });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
