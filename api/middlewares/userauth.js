const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
const Doctor = require("../models/DoctorSchema");
const Consultant = require("../models/ConsultantSchema");
const Patient = require("../models/PatientSchema");

const userauth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token, req.headers, "token auth page");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Access token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // console.log(decoded, "decoded");

    const role = decoded.role;

    let user = await Patient.findById(decoded.id);

    if (!user) {
      return res.status(403).json({
        error: "user not found",
      });
    }

    if (user.status === 2 || user.status === 0) {
      return res.status(403).json({
        error: "Your profile is blocked or deactivated",
      });
    }

    req.user = decoded.id;
    req.detail = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ error: "Access token is missing or invalid" });
  }
};

module.exports = userauth;
