function employerOnly(req, res, next) {
  if (req.user.role !== "employer")
    return res.status(403).json({ error: "Employers only" });
  next();
}

function jobSeekerOnly(req, res, next) {
  if (req.user.role !== "jobseeker")
    return res.status(403).json({ error: "Job Seekers only" });
  next();
}

module.exports = { employerOnly, jobSeekerOnly };
