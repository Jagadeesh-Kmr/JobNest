const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

const { authMiddleware } = require("./middleware/authMiddleware");
const upload = require("./utils/cloudinary");

//models
const User = require("./models/User");
const JobSeeker = require("./models/JobSeeker");
const Employer = require("./models/Employer");
const JobPosting = require("./models/JobPosting");
const Application = require("./models/Application");

const app = express();

app.use(cors());
app.use(express.json());

//Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      skills,
      education,
      experience,
      resume,
      portfolioLink,
      companyName,
      description,
      industry,
      website,
    } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Email, password, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    if (role === "employer") {
      const existingEmployer = await Employer.findOne({ companyName });
      if (existingEmployer) {
        return res
          .status(400)
          .json({ error: "Company name is already registered" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role });

    if (role === "jobseeker") {
      await JobSeeker.create({
        firstName: firstName || "",
        lastName: lastName || "",
        skills: Array.isArray(skills)
          ? skills
          : skills
          ? skills.split(",").map((s) => s.trim())
          : [],
        education: education || [],
        experience: experience || [],
        resume: resume || "",
        portfolioLink: portfolioLink || "",
        userId: user._id,
      });
    } else if (role === "employer") {
      await Employer.create({
        firstName: firstName || "",
        lastName: lastName || "",
        companyName: companyName || "",
        description: description || "",
        industry: industry || "",
        website: website || "",
        logo: "",
        userId: user._id,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { _id: user._id, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Profile Routes

// Search Jobs by Job Title
app.get("/api/jobs/search", async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: "Job title query parameter is required" });
    }

    const jobs = await JobPosting.find({
      isActive: true,
      title: { $regex: title, $options: "i" } // correct field name
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/profiles/jobseeker/:userId", async (req, res) => {
  try {
    const profile = await JobSeeker.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put(
  "/api/profiles/jobseeker/:userId",
  upload.single("resume"),
  async (req, res) => {
    try {
      const updateData = req.body;
      if (req.file) updateData.resume = req.file.path;

      const profile = await JobSeeker.findOneAndUpdate(
        { userId: req.params.userId },
        updateData,
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

app.get("/api/profiles/employer/:userId", async (req, res) => {
  try {
    const profile = await Employer.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put(
  "/api/profiles/employer/:userId",
  upload.single("logo"),
  async (req, res) => {
    try {
      const updateData = req.body;
      if (req.file) updateData.logo = req.file.path;

      const profile = await Employer.findOneAndUpdate(
        { userId: req.params.userId },
        updateData,
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

//Job Routes
function employerOnly(req, res, next) {
  if (req.user.role !== "employer") {
    return res.status(403).json({ error: "Access denied. Employers only." });
  }
  next();
}

function jobSeekerOnly(req, res, next) {
  if (req.user.role !== "jobseeker") {
    return res.status(403).json({ error: "Access denied. Job Seekers only." });
  }
  next();
}

app.post("/api/jobs", authMiddleware, employerOnly, async (req, res) => {
  try {
    const job = await JobPosting.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get("/api/jobs/my", authMiddleware, employerOnly, async (req, res) => {
  try {
    const jobs = await JobPosting.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await JobPosting.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});





//Application Routes
app.post(
  "/api/jobs/:id/apply",
  authMiddleware,
  jobSeekerOnly,
  async (req, res) => {
    try {
      const { coverLetter, resumeAttached } = req.body;

      const job = await JobPosting.findById(req.params.id);
      if (!job || !job.isActive) {
        return res.status(404).json({ error: "Job not found or inactive" });
      }

      const existing = await Application.findOne({
        jobId: job._id,
        jobSeekerId: req.user.id,
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "You have already applied to this job" });
      }

      const application = await Application.create({
        jobId: job._id,
        jobSeekerId: req.user.id,
        coverLetter,
        resumeAttached,
      });

      job.applicants.push(application._id);
      await job.save();

      res.status(201).json(application);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

app.get(
  "/api/applications/my",
  authMiddleware,
  jobSeekerOnly,
  async (req, res) => {
    try {
      const apps = await Application.find({
        jobSeekerId: req.user.id,
      }).populate("jobId");
      res.json(apps);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

app.delete(
  "/api/applications/:id",
  authMiddleware,
  jobSeekerOnly,
  async (req, res) => {
    try {
      const application = await Application.findOneAndDelete({
        _id: req.params.id,
        jobSeekerId: req.user.id,
      });

      if (!application)
        return res.status(404).json({ error: "Application not found" });

      res.json({ message: "Application deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

app.delete("/api/auth/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

//Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: err.message });
});

module.exports = app;
