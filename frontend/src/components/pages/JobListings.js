import { useEffect, useState } from "react";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async (title = "") => {
    try {
      setLoading(true);
      let url = "http://localhost:9000/api/jobs";
      if (title.trim()) {
        url = `http://localhost:9000/api/jobs/search?title=${encodeURIComponent(
          title
        )}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");
      setJobs(data);
      setMessage("");
    } catch (err) {
      setMessage(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in as a job seeker to apply.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:9000/api/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            coverLetter: "I am excited to apply for this position.",
            resumeAttached: "https://example.com/resume.pdf",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-white text-xl animate-pulse">Loading jobs...</p>
      </div>
    );

  if (message)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-red-400 text-lg">{message}</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-[80px] pb-[100px] px-4">
      {/* Heading */}
      <h2 className="md:text-4xl text-3xl font-extrabold mb-10 text-white tracking-wide">
        Available Jobs
      </h2>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-10 w-full max-w-xl"
      >
        <input
          type="text"
          placeholder="Search by job title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold shadow-md 
          hover:shadow-green-500/40 transform transition-all duration-300 hover:scale-105"
        >
          Search
        </button>
      </form>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <p className="text-gray-400 text-lg">No active job listings available.</p>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
  {jobs.map((job) => (
    <div
      key={job._id}
      className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl 
      transform transition-transform duration-500 hover:scale-105 hover:shadow-indigo-500/40 
      flex flex-col"
    >
      <h3 className="text-2xl font-semibold text-indigo-400 mb-2">
        {job.title}
      </h3>
      <p className="text-gray-300 mb-3">{job.description}</p>
      <p className="text-sm text-gray-400 mb-3">
        📍 {job.location} | 🕒 {job.jobType} | 💰 {job.salaryRange}
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4">
        {job.requirements.map((req, i) => (
          <li key={i}>{req}</li>
        ))}
      </ul>

      {/* Apply button fixed at bottom */}
      <button
        onClick={() => handleApply(job._id)}
        className="w-full mt-auto py-2 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 
        shadow-md hover:shadow-blue-500/40 transform transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        Apply
      </button>
    </div>
  ))}
</div>

      )}
    </div>
  );
}
