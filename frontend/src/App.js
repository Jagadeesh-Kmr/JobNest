import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import JobListings from "./components/pages/JobListings";
import MyProfile from "./components/pages/MyProfile";
import PostJob from "./components/pages/PostJob";
import MyApplications from "./components/pages/MyApplications";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login"; // Hard redirect to clear state
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} logout={logout} />
      <Routes>
         <Route
          path="/register"
          element={<Register setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <MyProfile />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/post-job"
          element={
            isAuthenticated ? (
              <PostJob />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/applications"
          element={
            isAuthenticated ? (
              <MyApplications />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
