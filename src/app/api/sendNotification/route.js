import PusherPushNotifications from "@pusher/push-notifications-server";

const beamsClient = new PusherPushNotifications({
  instanceId: "22594cbd-2c67-4ca5-91ca-1125afd2b102",
  secretKey: "A1CD58EDD66A8DD3EF7F6FA0789B2D7EA3778161A153408F449026057AE00AB6", // from Pusher dashboard
});

export async function POST(req) {
  const body = await req.json();

  try {
    await beamsClient.publishToInterests(["hello"], {
      web: {
        notification: {
          title: body.title || "New Alert!",
          body: body.message || "You have a new message",
        },
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
