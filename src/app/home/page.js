"use client";
import { useState } from "react";

export default function PushPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendNotification = async () => {
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });
      const data = await res.json();
      if (data.success) alert("✅ Notification sent!");
      else alert("❌ Failed: " + JSON.stringify(data.error));
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-6">Send Custom Notification</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded p-2 w-64 mb-3"
      />
      <br />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded p-2 w-64 h-24 mb-4"
      />
      <br />

      <button
        onClick={sendNotification}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
      >
        Send Notification
      </button>
    </div>
  );
}
