import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-center px-6 py-12">
      {/* Heading */}
      <h2 className="md:text-5xl text-3xl font-extrabold mb-6 mt-[80px] text-white tracking-wide text-center">
  Welcome to{" "}
  <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r  from-blue-500 to-green-600 animate-gradient-x">
    JobNest
  </span>
</h2>


      {/* Subtext */}
      <p className="text-lg text-gray-300 mb-10 max-w-3xl leading-relaxed">
        Your trusted platform to connect talented job seekers with top
        employers. Whether you’re looking for your dream job or the perfect
        candidate, we’ve got you covered.
      </p>

      {/* Two Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl w-full">
        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-indigo-500/40">
          <h1 className="text-2xl font-semibold text-indigo-400 mb-3">
            For Job Seekers
          </h1>
          <p className="text-gray-300">
            Explore thousands of job opportunities, apply instantly, and manage
            your applications in one place. Build your profile and land your
            dream career.
          </p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-105 hover:shadow-green-500/40">
          <h1 className="text-2xl font-semibold text-green-400 mb-3">
            For Employers
          </h1>
          <p className="text-gray-300">
            Post jobs, manage applications, and find the best talent for your
            organization. Our platform makes hiring quick, efficient, and
            hassle-free.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <Link
        to="/register"
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold 
        shadow-lg hover:shadow-orange-400/40 transform transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        Get Started
      </Link>
    </div>
  );
}
