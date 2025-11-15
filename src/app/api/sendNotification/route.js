import { NextResponse } from "next/server";

export async function POST(req) {
  const { token, title, body } = await req.json();

  const message = {
    to: token,
    notification: { title, body },
  };

  try {
    const res = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "key=" + "AIzaSyDgHPn_29cvngHV5cbyvTTdq6tqIczjdf8", // Add in Vercel
      },
      body: JSON.stringify(message),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
