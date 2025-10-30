import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "edge"; // 🟢 ensures serverless edge compatibility

// ✅ Connect to MongoDB (optimized for edge runtime)
let conn = null;
async function connectDB() {
  if (conn && mongoose.connection.readyState === 1) return conn;
  conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB Connected (work/[id])");
  return conn;
}

// ✅ Schema definition
const workSchema = new mongoose.Schema(
  {
    subject: String,
    work: String,
    deadline: String,
    addedBy: { type: String, default: "Admin" },
    fileUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    status: [
      {
        userId: String,
        username: String,
        state: {
          type: String,
          enum: ["completed", "doing", "not yet started"],
          default: "not yet started",
        },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    counts: {
      completed: { type: Number, default: 0 },
      doing: { type: Number, default: 0 },
      notYetStarted: { type: Number, default: 0 },
    },
  },
  { collection: "works" }
);

const Work = mongoose.models.Work || mongoose.model("Work", workSchema);

// ✅ Helper: recalc totals
async function getTotals() {
  const all = await Work.find();
  const totalWorks = all.length;
  let completed = 0,
    doing = 0,
    notYetStarted = 0;
  all.forEach((w) => {
    completed += w.counts.completed || 0;
    doing += w.counts.doing || 0;
    notYetStarted += w.counts.notYetStarted || 0;
  });
  return { totalWorks, completed, doing, notYetStarted };
}

// ✅ DELETE handler
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, message: "No ID provided" }, { status: 400 });
    }

    const deleted = await Work.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Work not found" }, { status: 404 });
    }

    const totals = await getTotals();
    return NextResponse.json({ success: true, totals });
  } catch (err) {
    console.error("❌ Delete error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
