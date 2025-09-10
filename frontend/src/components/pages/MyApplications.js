import { useEffect, useState } from "react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your applications.");
        return;
      }

      const res = await fetch("http://localhost:9000/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to fetch applications");
        return;
      }

      setApplications(data);
    } catch (err) {
      setError("Network error: Unable to fetch applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:9000/api/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to delete application");

      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <p className="text-red-400 text-lg font-semibold">{error}</p>
      </div>
    );

  // ✅ Empty state
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
          alt="No Applications"
          className="w-40 h-40 mb-4 opacity-80"
        />
        <h2 className="text-2xl font-bold text-white">No Applications Found</h2>
        <p className="text-gray-400 mt-2">
          You haven’t applied to any jobs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-[100px] pb-[60px] px-4">
      <h2 className="md:text-4xl text-3xl font-extrabold mb-12 text-white tracking-wide">
        My Applications
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl 
            transform transition-transform duration-500 hover:scale-105 hover:shadow-indigo-500/40"
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-2">
              {app.jobId?.title || "Job title not available"}
            </h3>
            <p className="text-gray-300 mb-3">
              {app.jobId?.description || "No description provided"}
            </p>
            <p className="text-sm text-gray-400 mb-2">
              <span className="font-semibold text-gray-200">
                Cover Letter:
              </span>{" "}
              {app.coverLetter}
            </p>
            <p className="text-sm mb-4">
              <span className="font-semibold text-gray-200">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  app.status === "pending"
                    ? "bg-yellow-600 text-white"
                    : app.status === "accepted"
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {app.status}
              </span>
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(app._id)}
                disabled={loading}
                className="px-4 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 
                text-white shadow-md hover:shadow-red-500/40 transform transition-all duration-300 
                hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Application"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
