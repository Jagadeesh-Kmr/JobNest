const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  companyName: { type: String, required: true, unique: true },
  description: String,
  industry: String,
  logo: String,
  website: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Employer", employerSchema);
