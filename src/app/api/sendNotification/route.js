import axios from "axios";

export async function POST(req) {
  try {
    const { title, message } = await req.json();

    // Validation
    if (!title || !message) {
      return new Response(JSON.stringify({ error: "Missing title or message" }), { status: 400 });
    }

    // Send to all subscribers
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: process.env.ONESIGNAL_APP_ID,
        included_segments: ["All"], // ✅ sends to ALL subscribers
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

    return new Response(JSON.stringify({ success: true, data: response.data }), { status: 200 });
  } catch (error) {
    console.error("❌ OneSignal Error:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({ error: error.response?.data || "Failed to send notification" }),
      { status: 500 }
    );
  }
}
