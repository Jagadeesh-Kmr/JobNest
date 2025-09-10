const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  skills: [String],
  education: [{ degree: String, institution: String, year: Number }],
  experience: [
    { title: String, company: String, years: Number, description: String },
  ],
  resume: String,
  portfolioLink: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
