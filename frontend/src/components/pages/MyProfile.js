import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userId = user._id || user.id;
        const url =
          user.role === "jobseeker"
            ? `http://localhost:9000/api/profiles/jobseeker/${userId}`
            : `http://localhost:9000/api/profiles/employer/${userId}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("Fetched profile:", data);

        if (!res.ok) {
          setError(data.error || "Failed to fetch profile");
          return;
        }
        setProfile(data);
      } catch (err) {
        setError("Network error: Unable to fetch profile");
      }
    };

    fetchProfile();
  }, [user, token, navigate]);

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
        <p className="text-gray-300 text-lg animate-pulse">Loading profile...</p>
      </div>
    );

  return (
        <div className="flex flex-col items-center md:justify-start justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-10">
  <h2 className="md:text-5xl text-3xl font-extrabold md:mb-8 mb-0 md:mt-0 mt-[40px] text-white tracking-wider text-center">
    My Profile
  </h2>

  <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full md:mt-0 mt-[80px] max-w-4xl space-y-6 text-gray-100">
    {user.role === "jobseeker" ? (
      <>
        {/* Basic Info */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-md space-y-2">
          <p>
            <span className="font-semibold text-indigo-400">Name:</span>{" "}
            {profile.firstName} {profile.lastName}
          </p>
          <p>
            <span className="font-semibold text-indigo-400">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-indigo-400">Skills:</span>{" "}
            {profile.skills?.join(", ") || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-indigo-400">Portfolio:</span>{" "}
            {profile.portfolioLink || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-indigo-400">Resume:</span>{" "}
            {profile.resume ? (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                View Resume
              </a>
            ) : (
              "Not uploaded"
            )}
          </p>
        </div>

        {/* Education */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">
            Education
          </h3>
          {profile.education?.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {profile.education.map((edu, idx) => (
                <li key={idx}>
                  {edu.degree} at {edu.institution} ({edu.year})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No education details added.</p>
          )}
        </div>

        {/* Experience */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-indigo-300 mb-2">
            Experience
          </h3>
          {profile.experience?.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              {profile.experience.map((exp, idx) => (
                <li key={idx}>
                  {exp.title} at {exp.company} – {exp.years} year(s). {exp.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No experience details added.</p>
          )}
        </div>
      </>
    ) : (
      <>
        {/* Employer Info */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-md space-y-2">
          <p>
            <span className="font-semibold text-green-400">Name:</span>{" "}
            {profile.firstName}
          </p>
          <p>
            <span className="font-semibold text-green-400">Company:</span>{" "}
            {profile.companyName}
          </p>
          <p>
            <span className="font-semibold text-green-400">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-green-400">Industry:</span>{" "}
            {profile.industry || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-green-400">Website:</span>{" "}
            {profile.website || "Not added"}
          </p>
          <p>
            <span className="font-semibold text-green-400">Description:</span>{" "}
            {profile.description || "Not provided"}
          </p>
          <p>
            <span className="font-semibold text-green-400">Logo:</span>{" "}
            {profile.logo ? (
              <img
                src={profile.logo}
                alt="Company Logo"
                className="h-16 mt-2 rounded-lg shadow-md"
              />
            ) : (
              "Not uploaded"
            )}
          </p>
        </div>
      </>
    )}
  </div>
</div>

  );
}
