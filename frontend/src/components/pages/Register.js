import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setIsAuthenticated }) {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [registrationDone, setRegistrationDone] = useState(false);
  const navigate = useNavigate();

  // Redirect after successful registration
  useEffect(() => {
    if (registrationDone) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [registrationDone, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:9000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          firstName,
          lastName,
          email,
          password,
          ...(role === "employer" && { companyName }),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setRegistrationDone(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // Success screen
  if (registrationDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-center px-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          className="w-20 sm:w-24 mb-6 drop-shadow-lg"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-green-400 mb-2">
          Registration Successful
        </h1>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">
          Redirecting you to the login page...
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-white font-semibold transition transform hover:scale-105"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Role selection screen
  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl text-white font-extrabold mb-6">
          Join Our <span  className="text-gradient bg-clip-text text-transparent bg-gradient-to-r  from-blue-500 to-green-600 animate-gradient-x">
            JobNest</span>
        </h2>
        <p className="text-gray-300 text-base sm:text-lg max-w-md text-center mb-10">
          Whether you're a job seeker or an employer, our platform connects{" "}
          <span className="text-blue-400">talent</span> with{" "}
          <span className="text-green-400">opportunity</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 w-full max-w-md">
          <div
            onClick={() => setRole("jobseeker")}
            className="cursor-pointer bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700 hover:border-blue-400 hover:shadow-xl transition flex-1 text-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Job Seeker"
              className="w-20 sm:w-24 mx-auto mb-4"
            />
            <h3 className="text-lg sm:text-xl font-bold text-blue-400">
              I’m a Job Seeker
            </h3>
          </div>

          <div
            onClick={() => setRole("employer")}
            className="cursor-pointer bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-700 hover:border-green-400 hover:shadow-xl transition flex-1 text-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135673.png"
              alt="Employer"
              className="w-20 sm:w-24 mx-auto mb-4"
            />
            <h3 className="text-lg sm:text-xl font-bold text-green-400">
              I’m an Employer
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-8 sm:mb-10 mt-10 sm:mt-[80px] text-center">
        Register as{" "}
        <span className="text-orange-400">
          {role === "jobseeker" ? "Job Seeker" : "Employer"}
        </span>
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg space-y-4"
      >
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          required
        />

        {role === "employer" && (
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        )}

        {error && <p className="text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg w-full transition transform hover:scale-105"
        >
          Register
        </button>
      </form>
    </div>
  );
}
