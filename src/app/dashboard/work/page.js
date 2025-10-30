"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

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

  // ✅ Decode JWT once on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded?.role === "admin");
      setUsername(decoded?.name || decoded?.username || "");
      setEmail(decoded?.email || "");
      setUserId(decoded?.userId || decoded?._id || "");
    } catch {
      localStorage.removeItem("token");
    }
  }, []);

  // ✅ Fetch works
  const fetchWorks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/works`);
      const data = await res.json();
      if (data.success) {
        setWorks(data.works || []);
        setTotals(data.totals || {});
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // ✅ Upload file (ImageKit or backend route)
  const uploadFile = async () => {
    if (!file) return "";
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/api/work`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data?.fileUrl || "";
    } catch (err) {
      console.error("File upload failed:", err);
      alert("File upload failed");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // ✅ Add new work (Admin only)
  const handleAddWork = async () => {
    if (!subject || !workText || !deadline) return alert("Fill all fields");
    const fileUrl = file ? await uploadFile() : "";
    try {
      const res = await fetch(`${API_BASE}/api/work/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, work: workText, deadline, fileUrl, addedBy: username }),
      });
      const data = await res.json();
      if (data.success) {
        setWorks([data.work, ...works]);
        setTotals(data.totals);
        setSubject("");
        setWorkText("");
        setDeadline("");
        setFile(null);
      } else alert(data.message || "Error adding work");
    } catch (err) {
      console.error("❌ Add work error:", err);
    }
  };

  // ✅ Update status (User)
  const handleStatusChange = async (workId, state) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login first");
    try {
      const res = await fetch(`${API_BASE}/api/work/status/${workId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, email, state }),
      });
      const data = await res.json();
      if (data.success) {
        setWorks((prev) => prev.map((w) => (w._id === data.work._id ? data.work : w)));
        setTotals(data.totals);
      } else alert(data.message || "Failed to update status");
    } catch (err) {
      console.error("❌ Update status error:", err);
    }
  };

  // ✅ Delete work (Admin only)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this work?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/work/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setWorks((prev) => prev.filter((w) => w._id !== id));
        setTotals(data.totals);
      } else alert("Failed to delete work");
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  // ✅ UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 flex flex-col items-center">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl mb-6">
        {[
          { label: "Total Works", value: totals.totalWorks, color: "bg-indigo-500", icon: "📚" },
          { label: "Completed", value: totals.completed, color: "bg-green-500", icon: "✅" },
          { label: "Doing", value: totals.doing, color: "bg-yellow-400", icon: "⚙️" },
          { label: "Not Started", value: totals.notYetStarted, color: "bg-rose-500", icon: "🕒" },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.color} text-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center`}
          >
            <div className="text-2xl">{card.icon}</div>
            <p className="text-xs uppercase tracking-wide">{card.label}</p>
            <h3 className="text-lg font-bold">{card.value ?? 0}</h3>
          </div>
        ))}
      </div>

      {/* Admin Add Form */}
      {isAdmin && (
        <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 border mb-8">
          <h2 className="text-lg font-semibold text-indigo-700 mb-4 flex items-center gap-2">➕ Add Work</h2>
          <div className="space-y-2">
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400" />
            <textarea placeholder="Work details" value={workText} onChange={(e) => setWorkText(e.target.value)}
              className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400" />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border rounded-md text-sm" />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" />
            <button onClick={handleAddWork} disabled={uploading}
              className={`w-full py-2 rounded-md text-white font-medium transition ${
                uploading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              }`}>
              {uploading ? "Uploading..." : "Add Work"}
            </button>
          </div>
        </div>
      )}

      {/* Work List */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-indigo-700 font-semibold text-base">📘 Current Works</h3>
          <button onClick={fetchWorks} className="text-indigo-500 text-sm hover:underline">Refresh</button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading...</div>
        ) : works.length === 0 ? (
          <div className="text-center text-gray-400 py-6">No works found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {works.map((w) => {
              const myStatus = (w.status || []).find((s) => s.userId === userId)?.state || "not yet started";
              return (
                <div key={w._id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-white to-indigo-50 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="mb-3">
                    <h4 className="font-semibold text-indigo-800">{w.subject}</h4>
                    <p className="text-gray-600 text-sm mt-1">{w.work}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      <b>Deadline:</b> {w.deadline ? new Date(w.deadline).toLocaleDateString() : "—"}
                    </p>
                    {w.fileUrl && (
                      <a href={w.fileUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs block mt-1">
                        📎 View File
                      </a>
                    )}
                    <p className="text-xs text-gray-400 mt-1">Added by: {w.addedBy || "Admin"}</p>

                    {/* ✅ NEW: Display count of each status */}
                    <div className="mt-2 text-xs text-gray-600 flex flex-col gap-0.5">
                      <p>✅ Completed: <b>{w.counts?.completed ?? 0}</b></p>
                      <p>⚙️ Doing: <b>{w.counts?.doing ?? 0}</b></p>
                      <p>🕒 Not Started: <b>{w.counts?.notYetStarted ?? 0}</b></p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["completed", "doing", "not yet started"].map((state) => (
                      <button key={state} onClick={() => handleStatusChange(w._id, state)}
                        className={`flex-1 text-xs py-1 rounded-md text-white transition ${
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
                        }`}>
                        {state === "completed" ? "✅ Completed" : state === "doing" ? "⚙️ Doing" : "🕒 Not Started"}
                      </button>
                    ))}
                    {isAdmin && (
                      <button onClick={() => handleDelete(w._id)} className="bg-red-500 text-white text-xs py-1 px-2 rounded-md hover:bg-red-600">
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
