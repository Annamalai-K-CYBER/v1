import axios from "axios";

export async function POST(req) {
  try {
    const { title, message } = await req.json();

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "dc464e50-ff8f-4ce6-a1b2-6d3805b556c2", // 👈 Replace this
        included_segments: ["All"], // send to all subscribed users
        headings: { en: title },
        contents: { en: message },
      },
      {
        headers: {
          Authorization: "Basic os_v2_app_3rde4uh7r5goninsnu4alnkwyjk372s3w5eelj5szq5cvrtsby53br5wwykq64p2p4s2j5rkxanxm755eednu7h7q52izckrznij5ny", // 👈 Replace this
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify({ success: true, data: response.data }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error sending notification:", err.response?.data || err.message);
    return new Response(JSON.stringify({ error: "Failed to send notification" }), {
      status: 500,
    });
  }
}
