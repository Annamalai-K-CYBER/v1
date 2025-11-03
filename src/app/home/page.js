"use client";
import { useState } from "react";

export default function SendNotification() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const sendNotification = async () => {
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    const data = await res.json();
    alert(data.success ? "✅ Notification sent!" : "❌ Failed");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Message"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={sendNotification}
      >
        Send
      </button>
    </div>
  );
}
