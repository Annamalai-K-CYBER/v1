"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function AnnouncementsPage() {
  const [form, setForm] = useState({
    topic: "",
    category: "General",
    details: "",
    image: null,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const categories = [
    { name: "General", color: "from-indigo-500 to-blue-500" },
    { name: "Events", color: "from-pink-500 to-rose-500" },
    { name: "Exams", color: "from-yellow-500 to-orange-500" },
    { name: "Updates", color: "from-emerald-500 to-teal-500" },
    { name: "Achievements", color: "from-purple-500 to-fuchsia-500" },
  ];

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("https://csbssync.vercel.app/api/announcements");
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.role === "admin") setIsAdmin(true);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.topic || !form.details) return alert("Please fill all fields");
    setUploading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));

      const res = await fetch("https://csbssync.vercel.app/api/announcements", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setForm({ topic: "", category: "General", details: "", image: null });
        fetchAnnouncements();
      } else alert(data.error || "Error adding announcement");
    } catch (err) {
      console.error(err);
      alert("Error uploading announcement");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`https://csbssync.vercel.app/api/announcements?id=${id}`, {
      method: "DELETE",
    });
    fetchAnnouncements();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* 🌟 Header */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          📢 Announcements
        </h1>

        {/* 🛠 Admin Add Form */}
        {isAdmin && (
          <form
            onSubmit={handleAdd}
            className="bg-white/60 backdrop-blur-xl border border-purple-200 rounded-2xl shadow-lg p-6 flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Announcement Topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Enter announcement details..."
              rows={4}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="p-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <button
              type="submit"
              disabled={uploading}
              className={`py-2 px-4 text-lg font-semibold rounded-xl text-white transition-all ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02]"
              }`}
            >
              {uploading ? "Uploading..." : "Add Announcement"}
            </button>
          </form>
        )}

        {/* 📚 Announcements Display */}
        {categories.map((cat) => {
          const filtered = announcements.filter((a) => a.category === cat.name);
          return (
            <div
              key={cat.name}
              className="bg-white/60 backdrop-blur-lg border border-indigo-100 rounded-2xl shadow-xl overflow-hidden"
            >
              {/* 🔽 Category Header */}
              <button
                onClick={() =>
                  setExpanded(expanded === cat.name ? null : cat.name)
                }
                className={`w-full flex justify-between items-center px-6 py-4 text-xl font-semibold text-white bg-gradient-to-r ${cat.color} transition-all duration-300`}
              >
                <span>
                  {cat.name}{" "}
                  <span className="bg-white/30 px-3 py-0.5 rounded-full text-sm ml-2">
                    {filtered.length}
                  </span>
                </span>
                <span className="text-white text-lg">
                  {expanded === cat.name ? "▲" : "▼"}
                </span>
              </button>

              {/* 📦 Dropdown Content */}
              {expanded === cat.name && (
                <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-gradient-to-b from-white to-indigo-50 animate-fadeIn">
                  {filtered.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 py-8">
                      No announcements in this category yet.
                    </p>
                  ) : (
                    filtered.map((a) => (
                      <div
                        key={a._id}
                        className="flex flex-col bg-white/90 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
                      >
                        {/* 🖼 Dynamic Image */}
                        {a.imageUrl ? (
                          <img
                            src={a.imageUrl}
                            alt={a.topic}
                            className="w-full object-contain max-h-[400px] bg-gray-50"
                          />
                        ) : (
                          <div className="w-full bg-gray-100 flex items-center justify-center aspect-video">
                            <img
                              src="https://img.icons8.com/cute-clipart/512/no-image.png"
                              alt="No Image"
                              className="w-24 opacity-70"
                            />
                          </div>
                        )}

                        <div className="p-5 flex flex-col flex-grow justify-between">
                          <div>
                            <h3 className="font-bold text-xl text-indigo-700 mb-2">
                              {a.topic}
                            </h3>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                              {a.details}
                            </p>
                          </div>

                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(a._id)}
                              className="mt-4 bg-gradient-to-r from-red-500 to-rose-500 hover:scale-[1.02] text-white py-1.5 rounded-lg text-sm transition-all"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
