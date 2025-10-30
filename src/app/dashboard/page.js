"use client";

export default function DashboardHome() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 drop-shadow-sm">
        🎓 Welcome to CSBS Sync
      </h1>
      <p className="text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
        Your all-in-one dashboard for study materials, assignments, and
        announcements. Stay updated and in sync with your CSBS community 🚀
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { title: "Study", color: "from-blue-500 to-cyan-400" },
          { title: "Material", color: "from-purple-500 to-pink-400" },
          { title: "Work", color: "from-green-500 to-teal-400" },
          { title: "Announcement", color: "from-orange-500 to-yellow-400" },
        ].map((item) => (
          <div
            key={item.title}
            className={`p-8 rounded-3xl shadow-lg bg-gradient-to-r ${item.color} text-white font-bold text-lg hover:scale-105 hover:shadow-2xl transform transition`}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}
