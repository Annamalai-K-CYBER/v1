import { NextResponse } from "next/server";
import mongoose from "mongoose";

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

// ✅ PATCH — Update status
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { userId, state } = await req.json();

    const work = await Work.findById(params.id);
    if (!work) return NextResponse.json({ message: "Work not found" }, { status: 404 });

    const userStatus = work.status.find((s) => s.userId === userId);
    if (userStatus) {
      userStatus.state = state;
    } else {
      work.status.push({ userId, state });
    }

    await work.save();
    return NextResponse.json({ message: "Status updated", work });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
