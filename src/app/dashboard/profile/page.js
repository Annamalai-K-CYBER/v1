"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const res = await fetch("https://csbssync.vercel.app/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Password changed successfully!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowChangePassword(false);
      } else {
        alert(data.error || "Something went wrong!");
      }
    } catch {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 px-4 py-10 text-gray-900">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-blue-600 text-transparent bg-clip-text">
          My Profile
        </h1>

        {user ? (
          <>
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-medium text-gray-700">Username:</span>
                <span className="text-gray-800">{user.username}</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-800 break-all">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition rounded-md"
            >
              {showChangePassword ? "Cancel" : "Change Password"}
            </button>

            {showChangePassword && (
              <form
                onSubmit={handlePasswordChange}
                className="mt-6 space-y-3 text-sm"
              >
                <input
                  type="password"
                  placeholder="Current Password"
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="w-full py-2 text-white font-semibold bg-gradient-to-r from-green-400 to-emerald-500 hover:from-emerald-500 hover:to-green-400 transition rounded-md"
                >
                  Update Password
                </button>
              </form>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
