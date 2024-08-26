const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminSchema");
// const admin = require("../models/adminschema");
const constants = require("../constants");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const Consultant = require("../models/ConsultantSchema");
const Doctor = require("../models/DoctorSchema");
const Query = require("../models/QuerySchema");
const { pagination } = require("./pagination");
const Aboutus = require("../models/AboutusSchema");
const Privacy = require("../models/PrivacyPolicySchema");
const Terms = require("../models/TermsSchema");
// const { pagination } = require("./pagination");

const editaboutus = async (req, res) => {
  try {
    // const adminid = req.params.adminid;
    const { aboutus } = req.body;

    let about = await Aboutus.getSingleton();

    about.aboutus = aboutus;

    await about.save();

    res
      .status(200)
      .json({ status: true, message: "About us updated successfully" });
  } catch (error) {
    console.error("Error updating About us:", error.message);
    res.status(500).json({ error: "Error updating About us" });
  }
};

const getaboutus = async (req, res) => {
  try {
    // const adminid = req.params.adminid;
    // console.log(adminid, "adminid");
    // const admin = await Admin.findById(adminid);

    // if (!admin) {
    //   return res.status(404).json({ error: "admin not found" });
    // }

    const about = await Aboutus.getSingleton();

    if (!about) {
      return res.status(500).json({ message: "about us details not found" });
    }

    res.status(200).json({
      status: true,
      message: "about us fetched successfully",
      data: about.aboutus ? about.aboutus : "",
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching privacy policy",
      error: "Error fetching privacy policy",
      data: error,
    });
  }
};

const editterms = async (req, res) => {
  try {
    // const adminid = req.params.adminid;
    const { terms } = req.body;

    let term = await Terms.getSingleton();

    term.terms = terms;

    await term.save();

    res
      .status(200)
      .json({ status: true, message: "Terms updated successfully" });
  } catch (error) {
    console.error("Error updating terms:", error.message);
    res.status(500).json({ error: "Error updating terms" });
  }
};

const getterms = async (req, res) => {
  try {
    // const adminid = req.params.adminid;
    // console.log(adminid, "adminid");
    // const admin = await Admin.findById(adminid);

    // if (!admin) {
    //   return res.status(404).json({ error: "admin not found" });
    // }

    const term = await Terms.getSingleton();

    if (!term) {
      return res
        .status(500)
        .json({ message: "term & conditions details not found" });
    }

    res.status(200).json({
      status: true,
      message: "about us fetched successfully",
      data: term.terms ? term.terms : "",
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({
      data: error,
      status: false,
      message: "Error fetching privacy policy",
      error: "Error fetching privacy policy",
    });
  }
};

const getPrivacyPolicy = async (req, res) => {
  try {
    // const adminid = req.params.adminid;
    // console.log(adminid, "adminid");

    // const admin = await Admin.findById(adminid);

    // if (!admin) {
    //   return res.status(404).json({ error: "admin not found" });
    // }
    const privacy = await Privacy.getSingleton();

    if (!privacy) {
      return res.status(500).json({ message: "privacy details not found" });
    }

    res.status(200).json({
      status: true,
      data: privacy.privacy ? privacy.privacy : "",
      message: "privacy policy fetched",
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    res.status(500).json({
      data: error,
      status: false,
      message: "Error fetching privacy policy",
      error: "Error fetching privacy policy",
    });
  }
};

// Edit/Add privacy policy for an admin
const editPrivacyPolicy = async (req, res) => {
  try {
    // const adminid = req.params.adminid;
    const { privacyPolicy } = req.body;

    // const admin = await Admin.findById(adminid);

    // if (!admin) {
    //   return res.status(404).json({ error: "admin not found" });
    // }

    // admin.privacy = privacyPolicy;
    // await admin.save();

    let privacy = await Privacy.getSingleton();

    privacy.privacy = privacyPolicy;

    await privacy.save();

    res.status(200).json({ message: "Privacy policy updated successfully" });
  } catch (error) {
    console.error("Error updating privacy policy:", error.message);
    res.status(500).json({ error: "Error updating privacy policy" });
  }
};

// queries

const createQuery = async (req, res) => {
  try {
    const { name, message, phone, memberId, adminId } = req.body;

    const newQuery = new Query({
      name,
      message,
      phone,
      member: memberId,
      admin: adminId,
      status: 2, // Default status is Active
    });

    const savedQuery = await newQuery.save();

    res.status(201).json({
      status: true,
      message: "Query created successfully",
      data: savedQuery,
    });
  } catch (error) {
    console.error("Error creating query:", error.message);
    res.status(500).json({
      data: error,
      status: false,
      message: "Error creating query",
      error: "Error creating query",
    });
  }
};

const getAllQueries = async (req, res) => {
  try {
    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    // const allQueries = await Query.find().populate("fpo").populate("member");

    const allQueries = await pagination(
      Query,
      Query.find().populate("admin").populate("member").sort({ status: -1 }),
      limitQuery
    );
    res.status(200).json({
      status: true,
      message: "successfull",
      data: allQueries,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
};

const getQueriesByAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;

    // Extract admin ID from request parameters

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };
    const queriesByadmin = await pagination(
      Query,
      Query.find({ admin: adminId })
        .populate("admin")
        .populate("member")
        .sort({ status: -1 }),
      limitQuery
    );
    // Fetch queries based on admin ID
    // const queriesByadmin = await Query.find({ admin: adminId })
    //   .populate("admin")
    //   .populate("member");

    res.status(200).json({
      status: true,
      message: "successfull",
      data: queriesByadmin,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
};

const changeQueryStatus = async (req, res) => {
  try {
    const queryId = req.params.queryId; // Extract Query ID from request parameters
    const { status } = req.body;

    // Update the status of the query
    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { status, updatedby: req.user },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Query status updated successfully",
      data: updatedQuery,
    });
  } catch (error) {
    console.error("Error updating query status:", error.message, error);
    res.status(500).json({ error: "Error updating query status" });
  }
};

module.exports = {
  editaboutus,
  getaboutus,
  getPrivacyPolicy,
  editPrivacyPolicy,
  createQuery,
  getAllQueries,
  getQueriesByAdmin,
  changeQueryStatus,
  editterms,
  getterms,
};
