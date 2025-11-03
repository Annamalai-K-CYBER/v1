"use client";
import axios from "axios";

export default function PushPage() {
  const sendNotification = async () => {
    try {
      const res = await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: "dc464e50-ff8f-4ce6-a1b2-6d3805b556c2",
          included_segments: ["All"],
          headings: { en: "🎓 CSBS SYNC" },
          contents: { en: "This is a test push notification!" },
          url: "https://csbssync.vercel.app", // optional
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "os_v2_app_3rde4uh7r5goninsnu4alnkwyi2gaogc5afeqlvz2fyl57hjwxl7b6obi57jy4st4mqc52y75z6s33pxuno7xldti3wkx2nydgnhheq", // 👈 Replace this
          },
        }
      );
      alert("✅ Notification Sent!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send notification");
    }
  };

  return (
    <div className="text-center mt-40">
      <h1 className="text-3xl font-bold mb-4">Send Test Notification</h1>
      <button
        onClick={sendNotification}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
      >
        Send Notification
      </button>
    </div>
  );
}
