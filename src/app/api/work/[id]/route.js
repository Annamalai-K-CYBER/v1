import { connectDB } from "@/lib/db";
import Work from "@/models/Work";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  await Work.findByIdAndDelete(id);

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

  return NextResponse.json({ success: true, totals });
}
