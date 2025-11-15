import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { uid, token } = await req.json();
    const client = await clientPromise;
    const db = client.db("csbs");

    await db.collection("fcmTokens").updateOne(
      { uid },
      { $set: { uid, token } },
      { upsert: true }
    );

    return Response.json({ success: true });
  } catch (e) {
    console.log(e);
    return Response.json({ success: false }, { status: 500 });
  }
}
