import axios from "axios";

export async function POST(req) {
  try {
    const { title, message } = await req.json();

    if (!title || !message) {
      return new Response(JSON.stringify({ error: "Missing title or message" }), { status: 400 });
    }

    if (!process.env.ONESIGNAL_APP_ID || !process.env.ONESIGNAL_REST_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OneSignal env vars" }), { status: 500 });
    }

    const res = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["All"],
        headings: { en: title },
        contents: { en: message },
      },
      {
        headers: {
          Authorization: `key ${process.env.ONESIGNAL_REST_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify({ ok: true, data: res.data }), { status: 200 });
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error("OneSignal error:", detail);
    return new Response(JSON.stringify({ error: detail }), { status: 500 });
  }
}
