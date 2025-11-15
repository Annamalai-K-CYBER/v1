import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, fcmToken } = await req.json();

    if (!userId || !fcmToken) {
      return Response.json(
        { success: false, message: "userId and fcmToken required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("csbs_sync");

    // Save or update token
    await db.collection("fcmTokens").updateOne(
      { userId },
      { $set: { userId, fcmToken } },
      { upsert: true }
    );

    return Response.json({ success: true, message: "Token saved" });
  } catch (error) {
    console.error("Token save error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
