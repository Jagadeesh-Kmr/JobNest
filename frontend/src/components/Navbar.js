import { Link, useNavigate } from "react-router-dom";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useState } from "react";

export default function Navbar({ isAuthenticated, logout }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const toggleMenu = () => setShowMobileMenu((prev) => !prev);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (user && token) {
        await fetch(`http://localhost:9000/api/auth/delete/${user._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    logout();
    localStorage.removeItem("user");
    navigate("/");
    setShowMobileMenu(false);
  };

  const links = !isAuthenticated
    ? [
        { to: "/login", label: "Login" },
        { to: "/register", label: "Register" },
      ]
    : [
        { to: "/jobs", label: "Job Listings" },
        { to: "/profile", label: "My Profile" },
        ...(user?.role === "employer"
          ? [{ to: "/post-job", label: "Post Job" }]
          : [{ to: "/applications", label: "My Applications" }]),
      ];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-200 shadow-lg px-6 py-4 flex justify-between items-center backdrop-blur-md relative">
      {/* Logo */}
      <div className="text-2xl font-extrabold tracking-wide text-white hover:scale-105 transform transition">
        <Link to="/" className="text-gradient bg-clip-text text-transparent bg-gradient-to-r  from-blue-500 to-green-600 animate-gradient-x">JobNest</Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 text-lg">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="hover:text-indigo-400 font-semibold transition-colors duration-300"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Desktop Logout */}
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="hidden md:block bg-red-500 hover:bg-red-400 shadow-md hover:shadow-red-500/40 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-3xl text-white"
      >
        {showMobileMenu ? <IoMdClose /> : <IoMdMenu />}
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-lg flex flex-col items-center py-6 space-y-4 md:hidden z-50">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setShowMobileMenu(false)}
              className="hover:text-indigo-400 font-semibold transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-400 shadow-md hover:shadow-red-500/40 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
