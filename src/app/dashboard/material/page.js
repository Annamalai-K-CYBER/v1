"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function UploadPage() {
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [file, setFile] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [subject, setSubject] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Materials
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://csbssync.vercel.app/api/materials");
      const data = await res.json();
      setMaterials(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // ✅ Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded?.username || "");
        setIsAdmin(decoded?.role === "admin");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  // ✅ Upload
  const handleUpload = async () => {
    if (!file || !materialName || !subject) {
      alert("Please fill all fields and select a file!");
      return;
    }
    if (!username) {
      alert("You must log in first!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("materialName", materialName);
    formData.append("subject", subject);
    formData.append("uploadDate", new Date().toISOString());

    try {
      const res = await fetch("https://csbssync.vercel.app/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.url);
        setMaterialName("");
        setSubject("");
        setFile(null);
        fetchMaterials();
      } else {
        alert(data.message || "Upload failed!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Open link safely
  const handleViewClick = (url) => {
    if (!url) {
      alert("No valid link found!");
      return;
    }
    try {
      const finalUrl = url.startsWith("http") ? url : `https://${url}`;
      window.open(finalUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Invalid URL:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-md">
          CSBS Study Materials 📚
        </h1>
        <p className="text-gray-600 mt-2">
          {username ? `Welcome, ${username} 👋` : "Please log in first."}
        </p>
      </div>

      {/* Admin Upload Section */}
      {isAdmin && (
        <div className="w-[90%] max-w-xl bg-white/80 shadow-xl rounded-2xl p-8 border border-gray-200 mb-10">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
            Upload New Material
          </h2>

          <input
            type="text"
            placeholder="Material name"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-4 border border-gray-300 rounded-md p-2 bg-white"
          />

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-3 font-semibold rounded-xl text-white transition-all ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
            }`}
          >
            {uploading ? "Uploading..." : "🚀 Upload Material"}
          </button>

          {uploadedUrl && (
            <div className="mt-5 text-center">
              <p className="text-gray-700 mb-1">✅ Uploaded Successfully!</p>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {uploadedUrl}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Materials List */}
      <div className="w-[95%] max-w-6xl bg-white/90 shadow-lg p-8 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Available Materials
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading...</p>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((mat, idx) => (
              <div
                key={idx}
                className="relative bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-2xl p-6 shadow hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {mat.matname}
                </h3>

                <p className="text-sm text-blue-600 font-medium mb-1">
                  Subject: {mat.subject || "N/A"}
                </p>

                <p className="text-xs text-gray-500 mb-2">
                  Uploaded on:{" "}
                  {mat.uploadDate
                    ? new Date(mat.uploadDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <img
                  src={
                    ["png", "jpg", "jpeg"].includes(
                      mat.format?.toLowerCase?.() || ""
                    )
                      ? "https://img.icons8.com/fluency/96/image.png"
                      : "https://img.icons8.com/fluency/96/document.png"
                  }
                  alt="icon"
                  className="w-16 h-16 mx-auto my-3"
                />

                <p className="text-sm text-gray-600 mb-3 text-center">
                  Uploaded by:{" "}
                  <span className="font-medium text-gray-800">
                    {mat.name || "Unknown"}
                  </span>
                </p>

                {mat.link ? (
                  <button
                    onClick={() => handleViewClick(mat.link)}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition"
                  >
                    🔗 View / Download
                  </button>
                ) : (
                  <p className="text-center text-gray-400 text-sm">
                    No link available
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No materials available yet.
          </p>
        )}
      </div>
    </div>
  );
}
