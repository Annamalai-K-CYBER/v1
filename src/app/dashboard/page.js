"use client";

import { useEffect, useState } from "react";
import { messaging, auth, db } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

export default function DashboardHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 🔔 NOTIFICATION SETUP
  // ============================================================
  const setupNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      const user = auth.currentUser;
      if (!user) return;

      // Save FCM token to Firestore
      await db.collection("fcmTokens").doc(user.uid).set({ token });

      // Foreground notifications
      onMessage(messaging, (payload) => {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
        });
      });

      // Send welcome notification from server
      await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          title: "Welcome to CSBS Sync 🎉",
          body: "You're now receiving notifications!",
        }),
      });
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  useEffect(() => {
    setupNotifications();
  }, []);

  // ============================================================
  // 📢 FETCH ANNOUNCEMENTS
  // ============================================================
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://csbssync.vercel.app/api/announcements");
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = announcements.filter(
    (a) => a.category === "General" || a.category === "Exams"
  );

  // ============================================================
  // 🎨 UI
  // ============================================================
  return (
    <div className="text-center py-10 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 drop-shadow-sm">
        🎓 Welcome to CSBS Sync
      </h1>

      <p className="text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
        Your all-in-one dashboard for study materials, assignments, and
        announcements. Stay updated and in sync with your CSBS community 🚀
      </p>

      {/* Announcements */}
      <div className="max-w-6xl mx-auto bg-white/80 rounded-3xl shadow-xl p-6 sm:p-10 border border-indigo-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6">
          📢 Latest Announcements
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="h-10 w-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.slice(0, 6).map((a) => (
              <div
                key={a._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="bg-gray-100 flex justify-center items-center">
                  <img
                    src={
                      a.imageUrl ||
                      "https://img.icons8.com/cute-clipart/512/no-image.png"
                    }
                    alt={a.topic}
                    className="w-full h-auto object-contain max-h-[300px]"
                  />
                </div>

                <div className="p-4 text-left">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 mb-2">
                    {a.category}
                  </span>
                  <h3 className="font-bold text-lg text-indigo-700 mb-2 line-clamp-1">
                    {a.topic}
                  </h3>
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {a.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="/dashboard/announcement"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl hover:opacity-90 transition"
          >
            View All Announcements →
          </a>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 my-14">
        {[
          { title: "Study", color: "from-blue-500 to-cyan-400", link: "/dashboard/study" },
          { title: "Material", color: "from-purple-500 to-pink-400", link: "/dashboard/material" },
          { title: "Work", color: "from-green-500 to-teal-400", link: "/dashboard/work" },
          { title: "Announcement", color: "from-orange-500 to-yellow-400", link: "/dashboard/announcement" },
        ].map((item) => (
          <a key={item.title} href={item.link}>
            <div
              className={`p-8 rounded-3xl shadow-lg bg-gradient-to-r ${item.color} text-white font-bold text-lg hover:scale-105 hover:shadow-2xl transition`}
            >
              {item.title}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
