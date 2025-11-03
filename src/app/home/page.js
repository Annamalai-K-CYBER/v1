"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendNotification = async () => {
    if (!title || !message) {
      setStatus("⚠️ Please enter both title and message");
      return;
    }

    try {
      setStatus("⏳ Sending...");
      const res = await axios.post("/api/sendNotification", { title, message });
      if (res.status === 200) setStatus("✅ Notification sent successfully!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to send notification");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-indigo-600">🔔 Send to All Subscribers</h1>

      <input
        type="text"
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-400 rounded-md p-2 w-64"
      />

      <input
        type="text"
        placeholder="Notification Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border border-gray-400 rounded-md p-2 w-64"
      />

      <button
        onClick={sendNotification}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Send Notification
      </button>

      {status && <p className="mt-2 text-gray-700">{status}</p>}
    </div>
  );
}
