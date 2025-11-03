import axios from "axios";

export async function POST(req) {
  try {
    const { title, message } = await req.json();

    if (!title || !message) {
      return new Response(JSON.stringify({ error: "Missing title or message" }), { status: 400 });
    }

    if (!process.env.ONESIGNAL_APP_ID || !process.env.ONESIGNAL_REST_API_KEY) {
      console.error("❌ Missing OneSignal environment variables");
      return new Response(JSON.stringify({ error: "Server config error" }), { status: 500 });
    }

    // ✅ Send to all subscribers
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
          Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OneSignal response:", res.data);
    return new Response(JSON.stringify({ success: true, data: res.data }), { status: 200 });
  } catch (error) {
    console.error("❌ OneSignal API Error:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({
        error: error.response?.data || error.message,
      }),
      { status: 500 }
    );
  }
}
