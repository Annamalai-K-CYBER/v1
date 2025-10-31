"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function WorkPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [works, setWorks] = useState([]);
  const [totals, setTotals] = useState({
    totalWorks: 0,
    completed: 0,
    doing: 0,
    notYetStarted: 0,
  });

  const [subject, setSubject] = useState("");
  const [workText, setWorkText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Decode JWT once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded?.role === "admin");
      setUsername(decoded?.username || decoded?.name || "");
      setEmail(decoded?.email || "");
      setUserId(decoded?.userId || decoded?._id || "");
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
  }, []);

  // ✅ Fetch all works + compute totals
  const fetchWorks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/work", { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        const worksData = data.works || [];

        // Totals for this user
        let completed = 0,
          doing = 0,
          notYetStarted = 0;

        worksData.forEach((work) => {
          const myStatus = (work.status || []).find((s) => s.userId === userId);
          if (myStatus?.state === "completed") completed++;
          else if (myStatus?.state === "doing") doing++;
          else notYetStarted++;
        });

        setWorks(worksData);
        setTotals({
          totalWorks: worksData.length,
          completed,
          doing,
          notYetStarted,
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [userId]);

  // ✅ Upload file to backend
  const uploadFile = async () => {
    if (!file) return "";
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/work/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data?.url || "";
    } catch (err) {
      console.error("Upload failed:", err);
      return "";
    } finally {
      setUploading(false);
    }
  };

  // ✅ Add work (admin)
  const handleAddWork = async () => {
    if (!subject || !workText || !deadline) return alert("Please fill all fields");
    const fileUrl = file ? await uploadFile() : "";

    try {
      const res = await fetch("/api/work/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          work: workText,
          deadline,
          fileUrl,
          addedBy: username,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubject("");
        setWorkText("");
        setDeadline("");
        setFile(null);
        fetchWorks();
      } else alert(data.message);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ✅ Update user status
  const handleStatusChange = async (workId, state) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch(`/api/work/status/${workId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, email, state }),
      });
      const data = await res.json();
      if (data.success) fetchWorks();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // ✅ Delete work (admin only)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this work?")) return;
    try {
      await fetch(`/api/work/${id}`, { method: "DELETE" });
      fetchWorks();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ UI rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-3 flex flex-col items-center">
      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-6">
        {[
          { label: "Total Works", value: totals.totalWorks, color: "bg-indigo-500", icon: "📚" },
          { label: "Completed", value: totals.completed, color: "bg-green-500", icon: "✅" },
          { label: "Doing", value: totals.doing, color: "bg-yellow-400", icon: "⚙️" },
          { label: "Not Started", value: totals.notYetStarted, color: "bg-rose-500", icon: "🕒" },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.color} text-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center transition hover:scale-105`}
          >
            <div className="text-2xl">{card.icon}</div>
            <p className="text-xs uppercase tracking-wide">{card.label}</p>
            <h3 className="text-lg font-bold">{card.value ?? 0}</h3>
          </div>
        ))}
      </div>

      {/* Add work (admin only) */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-md border mb-8">
          <h2 className="text-lg font-semibold text-indigo-700 mb-3">➕ Add Work</h2>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-2 p-2 border rounded-md text-sm"
          />
          <textarea
            placeholder="Work details"
            value={workText}
            onChange={(e) => setWorkText(e.target.value)}
            className="w-full mb-2 p-2 border rounded-md text-sm"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full mb-2 p-2 border rounded-md text-sm"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-3 text-sm"
          />
          <button
            onClick={handleAddWork}
            disabled={uploading}
            className={`w-full py-2 rounded-md text-white text-sm font-semibold ${
              uploading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {uploading ? "Uploading..." : "Add Work"}
          </button>
        </div>
      )}

      {/* Works List */}
      <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-4xl border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-indigo-700 font-semibold text-base">📘 Current Works</h3>
          <button onClick={fetchWorks} className="text-indigo-500 text-sm hover:underline">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading...</div>
        ) : works.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No works found</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {works.map((w) => {
              // 3 status counts
              const counts = { completed: 0, doing: 0, notYetStarted: 0 };
              (w.status || []).forEach((s) => {
                if (s.state === "completed") counts.completed++;
                else if (s.state === "doing") counts.doing++;
                else counts.notYetStarted++;
              });

              // ensure total 3 entries
              ["completed", "doing", "notYetStarted"].forEach(
                (key) => (counts[key] = counts[key] || 0)
              );

              const myStatus =
                (w.status || []).find((s) => s.userId === userId)?.state ||
                "not yet started";

              return (
                <div
                  key={w._id}
                  className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-white to-indigo-50 shadow-sm"
                >
                  <h4 className="font-semibold text-indigo-800">{w.subject}</h4>
                  <p className="text-gray-600 text-sm mt-1">{w.work}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    <b>Deadline:</b>{" "}
                    {w.deadline ? new Date(w.deadline).toLocaleDateString() : "—"}
                  </p>
                  {w.fileUrl && (
                    <a
                      href={w.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline text-xs block mt-1"
                    >
                      📎 View File
                    </a>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Added by: {w.addedBy || "Admin"}
                  </p>

                  {/* Counts per work */}
                  <div className="mt-3 flex justify-between bg-gray-100 rounded-lg p-2 text-xs font-medium">
                    <div className="text-green-600">✅ {counts.completed}</div>
                    <div className="text-yellow-600">⚙️ {counts.doing}</div>
                    <div className="text-rose-600">🕒 {counts.notYetStarted}</div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["completed", "doing", "not yet started"].map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStatusChange(w._id, state)}
                        className={`flex-1 text-xs py-1 rounded-md text-white ${
                          myStatus === state
                            ? state === "completed"
                              ? "bg-green-700"
                              : state === "doing"
                              ? "bg-yellow-600"
                              : "bg-gray-700"
                            : state === "completed"
                            ? "bg-green-500"
                            : state === "doing"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {state === "completed"
                          ? "✅ Completed"
                          : state === "doing"
                          ? "⚙️ Doing"
                          : "🕒 Not Started"}
                      </button>
                    ))}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(w._id)}
                        className="bg-red-500 text-white text-xs py-1 px-2 rounded-md"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
