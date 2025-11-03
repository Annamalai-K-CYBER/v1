"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendNotification = async () => {
    setStatus("Sending...");
    try {
      const res = await axios.post("/api/sendNotification", { title, message });
      setStatus("✅ Sent Successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error sending notification");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-2xl font-bold">🔔 Send OneSignal Notification</h1>

      <input
        className="border p-2 rounded w-64"
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 rounded w-64"
        placeholder="Notification Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendNotification}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Send Notification
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}
