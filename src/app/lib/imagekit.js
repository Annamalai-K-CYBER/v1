import { NextResponse } from "next/server";
import { ImageKit } from "@/app/lib/imagekit";

export const runtime = "edge";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await ImageKit.upload({
      file: buffer,
      fileName: file.name,
      folder: "works",
    });

    return NextResponse.json({ success: true, fileUrl: uploaded.url });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
