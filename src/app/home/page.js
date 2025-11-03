// pages/push.js
"use client";
import { useEffect } from "react";
import axios from "axios";

export default function PushTest() {
  // Ask for permission
  useEffect(() => {
    if (typeof window !== "undefined" && window.OneSignal) {
      window.OneSignal.showSlidedownPrompt();
    }
  }, []);

  const sendNotification = async () => {
    try {
      const res = await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: "dc464e50-ff8f-4ce6-a1b2-6d3805b556c2", // 👈 replace this
          included_segments: ["All"],
          headings: { en: "🚀 Test Notification" },
          contents: { en: "This is a test push from Next.js!" },
          url: "https://your-site.vercel.app", // optional
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "os_v2_app_3rde4uh7r5goninsnu4alnkwyi2gaogc5afeqlvz2fyl57hjwxl7b6obi57jy4st4mqc52y75z6s33pxuno7xldti3wkx2nydgnhheq", // 👈 replace this
          },
        }
      );
      console.log("Notification sent ✅", res.data);
      alert("Notification sent!");
    } catch (err) {
      console.error("Error:", err.response?.data || err);
      alert("Failed to send notification!");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🔔 OneSignal Push Test</h1>
      <p>Click below to send a test push notification to all subscribers.</p>
      <button
        onClick={sendNotification}
        style={{
          background: "#6366f1",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Send Notification
      </button>
    </div>
  );
}
