import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  uid: String,
  token: String,
});

const Token =
  mongoose.models.Token || mongoose.model("Token", tokenSchema);

export async function POST(req) {
  await connectDB();

  const { uid, token } = await req.json();

  await Token.updateOne(
    { uid },
    { $set: { uid, token } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
