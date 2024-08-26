const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
const Doctor = require("../models/DoctorSchema");
const Consultant = require("../models/ConsultantSchema");
const authenticate = async (req, res, next) => {
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

    let user;

    let realid;

    if (role === "superadmin" || role === "admin") {
      user = await Admin.findById(decoded.id);
      realid = user._id;
    } else if (role === "consultant") {
      user = await Consultant.findById(decoded.id);
      realid = user.memberId;
    } else if (role === "doctor") {
      user = await Doctor.findById(decoded.id);
      realid = user.memberId;
    }

    if (!user) {
      return res.status(403).json({
        error: "You do not have privileges or user not exists",
      });
    }

    if (user.status === 2 || user.status === 0) {
      return res.status(403).json({
        error: "Your profile is blocked or deactivated",
      });
    }

    // console.log(user, "user");

    req.user = decoded.id;
    req.detail = decoded;
    req.realid = realid;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ error: "Access token is missing or invalid" });
  }
};

module.exports = authenticate;
