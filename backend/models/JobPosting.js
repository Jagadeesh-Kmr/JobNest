const mongoose = require("mongoose");

const jobPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    salaryRange: String,
    location: String,
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobPosting", jobPostingSchema);
