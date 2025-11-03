// app/api/notify/route.js
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "dc464e50-ff8f-4ce6-a1b2-6d3805b556c2", // 👈 Replace this
        included_segments: ["All"],
        headings: { en: body.title || "🔔 CSBS SYNC" },
        contents: { en: body.message || "Test notification from Next.js" },
        url: "https://csbssync.vercel.app",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "os_v2_app_3rde4uh7r5goninsnu4alnkwyi2gaogc5afeqlvz2fyl57hjwxl7b6obi57jy4st4mqc52y75z6s33pxuno7xldti3wkx2nydgnhheq", // 👈 Keep safe
        },
      }
    );

    return Response.json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error);
    return Response.json(
      { success: false, error: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
