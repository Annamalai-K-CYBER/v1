// app/api/notify/route.js
import * as PusherPushNotifications from "@pusher/push-notifications-server";

export async function POST(req) {
  try {
    const { title, body } = await req.json();

    const beamsClient = new PusherPushNotifications({
      instanceId: "22594cbd-2c67-4ca5-91ca-1125afd2b102", // same as frontend
      secretKey: "A1CD58EDD66A8DD3EF7F6FA0789B2D7EA3778161A153408F449026057AE00AB6",   // from dashboard
    });

    await beamsClient.publishToInterests(["general"], {
      web: {
        notification: {
          title: title || "CSBS SYNC",
          body: body || "Test notification from Next.js + Pusher Beams",
          deep_link: "https://csbssync.vercel.app",
        },
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
