"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ make sure this package is installed

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
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Admin check

  const categories = [
    { name: "General", color: "from-indigo-500 to-blue-500" },
    { name: "Events", color: "from-pink-500 to-rose-500" },
    { name: "Exams", color: "from-yellow-500 to-orange-500" },
    { name: "Updates", color: "from-emerald-500 to-teal-500" },
    { name: "Achievements", color: "from-purple-500 to-fuchsia-500" },
  ];

  // ✅ Fetch announcements
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

    // ✅ Check if user is admin
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

  // ✅ Add new announcement
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

  // ✅ Delete announcement (Admin only)
  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`https://csbssync.vercel.app/api/announcements?id=${id}`, {
      method: "DELETE",
    });
    fetchAnnouncements();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-3 py-6 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* ✅ Header */}
        <h1 className="text-[20px] sm:text-3xl md:text-4xl font-extrabold text-center text-indigo-700 drop-shadow-md">
          📢 Announcements
        </h1>

        {/* ✅ Add Form (Admin Only) */}
        {isAdmin && (
          <form
            onSubmit={handleAdd}
            className="bg-white/90 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-purple-200 flex flex-col gap-4"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
              >
                {categories.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Details"
              rows={3}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="p-2 rounded-lg border focus:ring-2 focus:ring-indigo-400"
            />

            <button
              type="submit"
              disabled={uploading}
              className={`py-2 px-4 rounded-xl font-semibold text-white transition-all ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
              }`}
            >
              {uploading ? "Uploading..." : "Add Announcement"}
            </button>
          </form>
        )}

        {/* ✅ Announcements Display */}
        {categories.map((cat) => {
          const filtered = announcements.filter((a) => a.category === cat.name);
          return (
            <div
              key={cat.name}
              className="bg-white/80 rounded-2xl overflow-hidden shadow-lg border border-indigo-100"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === cat.name ? null : cat.name)
                }
                className={`w-full flex justify-between items-center px-5 py-3 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r ${cat.color}`}
              >
                <span className="truncate">
                  {cat.name}{" "}
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-lg text-sm">
                    {filtered.length}
                  </span>
                </span>
                <span className="text-white text-lg">
                  {expanded === cat.name ? "▲" : "▼"}
                </span>
              </button>

              {expanded === cat.name && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gradient-to-b from-white to-indigo-50">
                  {filtered.length === 0 ? (
                    <p className="text-gray-500 text-center w-full py-6">
                      No announcements in this category.
                    </p>
                  ) : (
                    filtered.map((a) => (
                      <div
                        key={a._id}
                        className="flex flex-col overflow-hidden bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="h-64 w-full bg-gray-100">
                          <img
                            src={
                              a.imageUrl ||
                              "https://img.icons8.com/cute-clipart/512/no-image.png"
                            }
                            alt={a.topic}
                            className="w-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow justify-between">
                          <div>
                            <h3 className="font-bold text-indigo-700 text-lg truncate">
                              {a.topic}
                            </h3>
                            <p className="text-gray-700 text-sm mt-1 line-clamp-3">
                              {a.details}
                            </p>
                          </div>

                          {/* ✅ Delete only visible for Admin */}
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(a._id)}
                              className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg text-sm transition"
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
