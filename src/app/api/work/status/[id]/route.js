import { connectDB } from "@/lib/db";
import Work from "@/models/Work";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
  const { userId, username, email, state } = await req.json();

  const work = await Work.findById(id);
  if (!work) return NextResponse.json({ success: false, message: "Work not found" });

  const existing = work.status.find((s) => s.userId === userId);
  if (existing) existing.state = state;
  else work.status.push({ userId, username, email, state });

  await work.save();

  const works = await Work.find();
  const totals = {
    totalWorks: works.length,
    completed: 0,
    doing: 0,
    notYetStarted: 0,
  };
  works.forEach((w) => {
    w.status?.forEach((s) => {
      if (s.state === "completed") totals.completed++;
      else if (s.state === "doing") totals.doing++;
      else totals.notYetStarted++;
    });
  });

  return NextResponse.json({ success: true, work, totals });
}
