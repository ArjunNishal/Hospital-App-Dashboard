const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
// const FPO = require("../models/Fposchema");
const constants = require("../constants");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const Consultant = require("../models/ConsultantSchema");
const Doctor = require("../models/DoctorSchema");
const Patient = require("../models/PatientSchema");

exports.userlogin = async (req, res) => {
  try {
    // const { role } = req.query;

    const patient = await Patient.findOne({ mobileno: req.body.mobileno });

    if (!patient) {
      return res.status(404).send({ message: "Not a registered patient" });
    }
    if (patient.status === 2) {
      return res.status(500).send({ message: "Your Account is blocked" });
    }
    if (patient.status === 0) {
      return res.status(500).send({
        message: "Your Account is Deactivated",
      });
    }

    // console.log(req.body.password, patient.password);
    const isMatch = patient.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: patient._id,
        username: patient.username,
        firstName: patient.firstName,
        lastName: patient.lastName,
        mobileno: patient.mobileno,
        role: patient.role,
        email: patient.email,
        permissions: patient.permissions,
        image: patient.image,
        admin: patient.admin,
        createdby: patient.createdby,
        middlename: patient.middlename,
        status: patient.status,

        // fpo: patient?.fpo,
        // image: patient?.image,
      },
      process.env.JWT_SECRET_KEY
    );

    const patient2 = await Patient.findOne({
      mobileno: req.body.mobileno,
    }).select("-password");

    patient.jwtToken = token;
    await patient.save();

    const dates = {
      date1: patient.date1,
      date2: patient.date2,
    };

    const urls = {
      blog: `${constants.renderUrl}uploads/blogs/`,
      profile: `${constants.renderUrl}uploads/profile/`,
      profileform: `${constants.renderUrl}uploads/profileform/`,
      weeks: `${constants.renderUrl}uploads/weeks/`,
      common: `${constants.renderUrl}uploads/`,
    };
    // jwtToken
    res.status(200).send({
      status: true,
      data: { patient2, urls, dates },
      message: "logged in",
      // patient: patient2,
      token,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ e, data: e, message: "error occurred", status: false });
  }
};

exports.userlogout = async (req, res) => {
  try {
    // const { role } = req.query;

    const patient = await Patient.findById(req.body.id);

    if (!patient) {
      return res.status(404).send({ message: "Not a registered patient" });
    }

    patient.jwtToken = "";
    await patient.save();
    // jwtToken
    res.status(200).send({ status: true, message: "logged out" });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ e, data: e, message: "error occurred", status: false });
  }
};

exports.doclogout = async (req, res) => {
  try {
    // const { role } = req.query;

    const doctor = await Doctor.findById(req.body.id);

    if (!doctor) {
      return res
        .status(404)
        .send({ status: false, message: "Not a registered doctor" });
    }

    doctor.jwtToken = "";
    await doctor.save();
    // jwtToken
    res.status(200).send({ status: true, message: "logged out" });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ e, data: e, message: "error occurred", status: false });
  }
};

exports.DoctorLogin = async (req, res) => {
  try {
    const admin = await Doctor.findOne({ mobileno: req.body.mobileno });
    if (!admin) {
      return res.status(404).send({ message: "Not a registered Doctor" });
    }
    if (admin.status === 2) {
      return res.status(500).send({
        message: "Your Account is blocked, Please contact Superadmin",
      });
    }
    if (admin.status === 0) {
      return res.status(500).send({
        message: "Your Account is Deactivated, Please contact Superadmin",
      });
    }

    console.log(req.body.password, admin.password);
    const isMatch = admin.password === req.body.password;
    console.log(isMatch);
    if (!isMatch)
      return res.status(500).json({ message: "Password is incorrect." });

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        mobileno: admin.mobileno,
        role: admin.role,
        email: admin.email,
        permissions: admin.permissions,
        adminId: admin.admin,
        memberid: admin.memberId,
        image: admin.image,

        // fpo: admin?.fpo,
        // image: admin?.image,
      },
      process.env.JWT_SECRET_KEY
    );

    admin.jwtToken = token;
    await admin.save();
    res.status(200).send({
      status: true,
      data: { doctor: admin, token },
      message: "Logged in successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: false, message: "Login failed", error: e });
  }
};
