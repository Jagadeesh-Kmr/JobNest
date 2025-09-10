import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    salaryRange: "",
    location: "",
    jobType: "Full-time",
  });
  const [message, setMessage] = useState("");
  const [isEmployer, setIsEmployer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "employer") {
      setIsEmployer(true);
    } else {
      setMessage("Access denied: Employers only.");
      setTimeout(() => navigate("/jobs"), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("You must log in as an employer to post a job.");
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split(",").map((r) => r.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post job");

      setMessage("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        requirements: "",
        salaryRange: "",
        location: "",
        jobType: "Full-time",
      });
    } catch (err) {
      setMessage(`${err.message}`);
    }
  };

  if (!isEmployer) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-6 rounded-2xl shadow-lg bg-gray-800 text-center">
        <p className="text-red-400 font-semibold">{message || "Checking access..."}</p>
      </div>
    );
  }

  return (
   <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black px-4 md:px-6 pt-24 md:pt-20 pb-10 overflow-y-auto">
  <h2 className="text-4xl font-extrabold mb-8 text-white tracking-wide mt-0 md:mt-[0px]">
    Post a Job
  </h2>
  <form
    onSubmit={handleSubmit}
    className="bg-gray-900/70 backdrop-blur-md border border-gray-700 p-8 md:mt-[2px] mt-[30px] rounded-2xl shadow-2xl w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    {/* Job Title */}
    <input
      type="text"
      name="title"
      placeholder="Job Title"
      value={formData.title}
      onChange={handleChange}
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
      required
    />

    {/* Salary Range */}
    <input
      type="text"
      name="salaryRange"
      placeholder="Salary Range"
      value={formData.salaryRange}
      onChange={handleChange}
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
    />

    {/* Description */}
    <textarea
      name="description"
      placeholder="Job Description"
      value={formData.description}
      onChange={handleChange}
      rows="4"
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none md:col-span-2"
      required
    />

    {/* Requirements */}
    <input
      type="text"
      name="requirements"
      placeholder="Requirements (comma-separated)"
      value={formData.requirements}
      onChange={handleChange}
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none md:col-span-2"
      required
    />

    {/* Location */}
    <input
      type="text"
      name="location"
      placeholder="Location"
      value={formData.location}
      onChange={handleChange}
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
    />

    {/* Job Type */}
    <select
      name="jobType"
      value={formData.jobType}
      onChange={handleChange}
      className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-green-400 outline-none"
    >
      <option value="Full-time">Full-time</option>
      <option value="Part-time">Part-time</option>
      <option value="Contract">Contract</option>
      <option value="Internship">Internship</option>
    </select>

    {/* Status Message */}
    {message && (
      <p
        className={`md:col-span-2 font-semibold text-center ${
          message.includes("✅") ? "text-green-400" : "text-red-400"
        }`}
      >
        {message}
      </p>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      className="md:col-span-2 w-[200px] justify-self-center bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-lg"
    >
      Post Job
    </button>
  </form>
</div>

  );
}
