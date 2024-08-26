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

const NoteDiary = require("../models/NoteDiarySchema");
const Blog = require("../models/BlogsSchema");
const BlogCat = require("../models/BlogCategorySchema");
const WeekMaster = require("../models/WeekMasterSchema");
const Week = require("../models/WeeksSchema");
const PersonalData = require("../models/PersoneldetailsSchema");
const Appointment = require("../models/appointmentSchema");
const { pagination } = require("./pagination");
const fs = require("fs");
// Add a new diary entry

exports.addDiaryEntry = async (req, res) => {
  try {
    const { date, content } = req.body;
    const patient = req.user;

    const existingdiary = await NoteDiary.findOne({ date });

    if (existingdiary) {
      return res.status(500).send({
        status: false,
        message: "Diary with same date already exists",
      });
    }

    const newDiaryEntry = new NoteDiary({
      date,
      content,
      patient,
    });

    await newDiaryEntry.save();

    res.status(201).json({
      status: true,
      message: "Diary entry added successfully",
      data: newDiaryEntry,
    });
  } catch (error) {
    console.error("Error adding diary entry:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding the diary entry",
      error,
      data: error,
    });
  }
};

// Edit a diary entry
exports.editDiaryEntry = async (req, res) => {
  try {
    // const diaryEntryId = req.params.id;
    const { content, date } = req.body;
    const patient = req.user;

    // Check if a diary entry exists for the given date and patient
    let diaryEntry = await NoteDiary.findOne({ date, patient });

    if (diaryEntry) {
      // Update the existing diary entry
      diaryEntry.content = content;
      diaryEntry.date = date;
      await diaryEntry.save();
      res.status(200).json({
        status: true,
        message: "Diary entry updated successfully",
        diaryEntry,
      });
    } else {
      // Create a new diary entry if none exists for the given date
      const newDiaryEntry = new NoteDiary({
        content,
        date,
        patient,
      });
      await newDiaryEntry.save();
      res.status(201).json({
        status: true,
        message: "New diary entry created successfully",
        data: newDiaryEntry,
      });
    }
  } catch (error) {
    console.error("Error updating or creating diary entry:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while processing the diary entry",
      error,
      data: error,
    });
  }
};

// Delete a diary entry
exports.deleteDiaryEntry = async (req, res) => {
  try {
    const diaryEntryId = req.params.id;
    const patient = req.user;

    const deletedDiaryEntry = await NoteDiary.findOneAndDelete({
      _id: diaryEntryId,
      patient,
    });

    if (!deletedDiaryEntry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Diary entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the diary entry",
      error,
      data: error,
    });
  }
};

// Get all diary entries for a patient
exports.getDiaryEntries = async (req, res) => {
  try {
    const patient = req.user;

    const diaryEntries = await NoteDiary.find({ patient }).sort({ date: -1 });

    res.status(200).json({
      status: true,
      message: "Diary entries fetched successfully",
      data: diaryEntries,
    });
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the diary entries",
      error,
      data: error,
    });
  }
};

exports.getDiaryEntryByDate = async (req, res) => {
  try {
    const { date } = req.body;
    const patient = req.user;

    // Find the diary entry for the given date and patient
    const diaryEntry = await NoteDiary.findOne({ date, patient });

    if (!diaryEntry) {
      return res
        .status(404)
        .json({ message: "Diary entry not found for the given date" });
    }

    res.status(200).json({
      status: true,
      message: "Diary entry fetched successfully",
      data: diaryEntry,
    });
  } catch (error) {
    console.error("Error fetching diary entry:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the diary entry",
      error,
      data: error,
    });
  }
};

exports.homeapi = async (req, res) => {
  try {
    const categories = await BlogCat.find({
      // admin: req.detail.admin,
      status: 1,
    }).populate({
      path: "admin",
      model: "Admin",
    });

    const categoryBlogs = await Promise.all(
      categories.map(async (category) => {
        const blogs = await Blog.find({
          category: category._id,
          status: 1,
        }).populate("category");
        return {
          category,
          blogs,
        };
      })
    );

    const likedBlogs = await Blog.find({ likedby: req.user, status: 1 })
      .populate("category")
      .populate("admin", "username")
      .populate("createdby", "username")
      .populate("updatedby", "username");

    res.status(200).json({
      status: true,
      message: "Home fetched successfully",
      data: { categoryBlogs, likedBlogs },
    });
  } catch (error) {
    console.error("Error fetching home api:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching home api",
      error,
      data: error,
    });
  }
};

exports.getallblogsAndCatAndLiked = async (req, res) => {
  try {
    const categories = await BlogCat.find({
      // admin: req.detail.admin,
      status: 1,
    }).populate({
      path: "admin",
      model: "Admin",
    });

    const categoryBlogs = await Promise.all(
      categories.map(async (category) => {
        const blogs = await Blog.find({
          category: category._id,
          status: 1,
        }).populate("category");
        return {
          category,
          blogs,
        };
      })
    );

    const likedBlogs = await Blog.find({ likedby: req.user, status: 1 })
      .populate("category")
      .populate("admin", "username")
      .populate("createdby", "username")
      .populate("updatedby", "username");

    res.status(200).json({
      status: true,
      message: "Blogs fetched successfully",
      data: { categoryBlogs, likedBlogs },
    });
  } catch (error) {
    console.error("Error fetching Blogs api:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching Blogs api",
      error,
      data: error,
    });
  }
};

exports.getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await Blog.find({ category: categoryId, status: 1 }).populate(
      "category"
    );

    res.status(200).json({
      status: true,
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching blogs by category",
      error,
      data: error,
    });
  }
};

exports.getWeekDataByWeekMasterId = async (req, res) => {
  try {
    const { weekMasterId } = req.params;

    // Check if the WeekMaster ID exists
    const weekMaster = await WeekMaster.findById(weekMasterId);
    if (!weekMaster) {
      return res.status(404).json({ message: "WeekMaster not found" });
    }

    // Fetch the week data related to the WeekMaster ID
    const weekData = await Week.find({ week: weekMasterId, status: 1 })
      .populate("week")
      .populate("relatedblogs")
      .populate("admin")
      .populate("createdby");

    res.status(200).json({
      status: true,
      message: "Week data fetched successfully",
      data: weekData,
    });
  } catch (error) {
    console.error("Error fetching week data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching week data",
      error,
      data: error,
    });
  }
};

exports.getActiveWeeks = async (req, res) => {
  try {
    const activeWeeks = await Week.find({ status: 1 })
      .populate("week")
      .populate("admin", "username")
      .populate("createdby", "username")
      .populate("updatedby", "username")
      .populate("relatedblogs");

    res.status(200).json({
      status: true,
      message: "Active weeks fetched successfully",
      data: activeWeeks,
    });
  } catch (error) {
    console.error("Error fetching active weeks:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching active weeks",
      error: error.message || error,
    });
  }
};

// Create new weight data

// Get personal data of the patient
exports.getPersonalData = async (req, res) => {
  try {
    const { patientId } = req.body;
    const personalData = await PersonalData.findOne({
      patient: patientId,
    }).populate("patient");

    if (!personalData) {
      return res.status(404).json({ message: "Personal data not found" });
    }

    res.status(200).json({
      status: true,
      message: "Personal data fetched successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error fetching personal data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching personal data",
      error,
      data: error,
    });
  }
};

// Delete weight data from the weight tracker array

// kick data ==============================================================
exports.createKickCountData = async (req, res) => {
  try {
    const { patientId, start, duration, kicks, startdate, enddate } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
      });
    }

    personalData.kickCounts.push({
      start,
      duration,
      kicks,
      startdate,
      enddate,
    });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "Kick count data added successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error adding kick count data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding kick count data",
      error,
    });
  }
};

exports.getkickcounter = async (req, res) => {
  try {
    const { patientId } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    res.status(201).json({
      status: true,
      message: "Kick count data fetched successfully",
      data: personalData.kickCounts,
    });
  } catch (error) {
    console.error("Error fetching kick count data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching kick count data",
      error,
      data: error,
    });
  }
};

exports.editkickcounter = async (req, res) => {
  try {
    const { patientId, kickid, start, duration, kicks, startdate, enddate } =
      req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "Patient data not found",
      });
    }

    let kickCount = personalData.kickCounts.id(kickid);

    if (!kickCount) {
      return res.status(404).json({
        status: false,
        message: "Kick count entry not found",
      });
    }

    // Update the kick count details
    kickCount.start = start;
    kickCount.duration = duration;
    kickCount.kicks = kicks;
    kickCount.startdate = startdate;
    kickCount.enddate = enddate;

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "Kick count data updated successfully",
      data: kickCount,
    });
  } catch (error) {
    console.error("Error updating kick count data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating kick count data",
      error,
    });
  }
};

exports.deleteKickCount = async (req, res) => {
  try {
    const { patientId, kickid } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "Patient data not found",
      });
    }

    const kickCountIndex = personalData.kickCounts.findIndex(
      (kick) => kick._id.toString() === kickid
    );

    if (kickCountIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "Kick count entry not found",
      });
    }

    // Remove the kick count entry
    personalData.kickCounts.splice(kickCountIndex, 1);

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "Kick count data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting kick count data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting kick count data",
      error,
    });
  }
};
// ========================================================================

exports.createAppointment = async (req, res) => {
  try {
    const { patientId, date, concern, time } = req.body;

    console.log(patientId, time, "patientId");

    let doctorId;
    let patient;

    if (req.detail.role === "consultant" || req.detail.role === "doctor") {
      doctorId = req.realid;
      patient = await Patient.findById(patientId);
    } else if (req.detail.role === "patient") {
      patient = await Patient.findById(patientId);
      doctorId = patient.createdby;
    }

    // Validate doctor and patient existence
    console.log(doctorId);
    const doctor = await Admin.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ status: false, message: "Doctor not found" });
    }

    if (!patient) {
      return res
        .status(404)
        .json({ status: false, message: "Patient not found" });
    }

    const combinedDateTime = new Date(`${date}T${time}:00.000Z`);

    // Create new appointment
    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      date,
      concern,
      time: combinedDateTime,
    });

    await newAppointment.save();

    res.status(201).json({
      status: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while creating the appointment",
      error: error.message || error,
    });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // Validate the status
    if (![0, 1, 2].includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status value",
      });
    }

    // Find the appointment by ID and update the status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        status: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the appointment status",
      error: error.message || error,
    });
  }
};

exports.updateAppointmentDateAndConcern = async (req, res) => {
  try {
    const { appointmentId, date, time, concern } = req.body;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: false,
        message: "Appointment not found",
      });
    }

    // Check if the date is changed
    if (
      date &&
      new Date(date).getTime() !== new Date(appointment.date).getTime()
    ) {
      appointment.date = date;
      appointment.status = 0; // Reset status to 0 if the date is changed
    }

    // Update the concern
    if (concern) {
      appointment.concern = concern;
    }

    if (time) {
      const combinedDateTime = new Date(`${date}T${time}:00.000Z`);
      appointment.time = combinedDateTime;
    }

    await appointment.save();

    res.status(200).json({
      status: true,
      message: "Appointment date and concern updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error updating appointment date and concern:", error);
    res.status(500).json({
      status: false,
      message:
        "An error occurred while updating the appointment date and concern",
      error: error.message || error,
    });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { role, userId } = req.body;

    let appointments;

    if (role === "doctor" || role === "consultant") {
      appointments = await Appointment.find({ doctor: req.realid })
        .populate("doctor", "username")
        .populate("patient", "username");
    } else if (role === "patient") {
      appointments = await Appointment.find({ patient: userId })
        .populate("doctor", "-password")
        .populate("patient", "-password");
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid role",
      });
    }

    res.status(200).json({
      status: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching appointments",
      error: error.message || error,
    });
  }
};

exports.getAllAppointmentslist = async (req, res) => {
  try {
    // const { role, userId } = req.body;

    const appointments = await Appointment.find()
      .populate("doctor", "username")
      .populate("patient", "username");

    res.status(200).json({
      status: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching appointments",
      error: error.message || error,
    });
  }
};

// appointments with pagination

exports.getAllAppointmentswpage = async (req, res) => {
  try {
    const { role, userId } = req.body;

    // let appointments;
    let query = {};

    if (role === "doctor" || role === "consultant") {
      query = { doctor: req.realid };
    } else if (role === "patient") {
      query = { patient: userId };
    } else if (role === "superadmin") {
      query = {};
    }

    const limitQuery = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    // let query = { admin: req.params.adminId };

    const appointments = await pagination(
      Appointment,
      Appointment.find(query)
        .populate("doctor", "-password")
        .populate("patient", "-password")
        .sort({ createdAt: -1 }),
      limitQuery
    );

    res.status(200).json({
      status: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching appointments",
      error: error.message || error,
    });
  }
};

//  save eer data ====================================================================

exports.savedates = async (req, res) => {
  try {
    const { patientId, date1, date2 } = req.body;

    // Find the patient by ID
    let patient = await Patient.findById(patientId);

    // If patient not found, return an error response
    if (!patient) {
      return res.status(404).json({
        status: false,
        message: "Patient not found",
      });
    }

    // Update date1 and date2 if provided
    if (date1) patient.date1 = date1;
    if (date2) patient.date2 = date2;

    // Save the updated patient data
    await patient.save();

    res.status(201).json({
      status: true,
      message: "Dates saved successfully",
      data: { date1: patient.date1, date2: patient.date2 },
    });
  } catch (error) {
    console.error("Error saving dates:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while saving dates",
      error,
    });
  }
};

exports.resetpass = async (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword, oldpassword } = req.body;
  console.log(req.body, "body");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let user;

    if (decoded.role === "doctor") {
      user = await Doctor.findById(id);
    } else if (decoded.role === "patient") {
      user = await Patient.findById(id);
    } else {
      return res.status(500).send({ status: false, message: "Invalid token" });
    }

    if (!user) {
      return res
        .status(500)
        .send({ status: false, message: "Invalid user ID" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (user.password !== oldpassword) {
      return res
        .status(500)
        .send({ status: false, message: "Current password is incorrect" });
    } else if (password !== confirmPassword) {
      return res.status(500).send({
        status: false,
        message: "New password does not match confirm password",
      });
    }

    if (password.includes(" ")) {
      return res
        .status(500)
        .json({ status: false, message: "Password should not have spaces." });
    }

    if (decoded.role === "doctor") {
      const doctor = await Admin.findById(req.realid);
      if (decodedToken.id !== user.id && decoded.role === "doctor") {
        return res
          .status(500)
          .send({ status: false, message: "Invalid token" });
      }

      doctor.password = password;
      await doctor.save();
    }

    user.password = password;
    await user.save();

    res
      .status(200)
      .send({ status: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Server error" });
  }
};

// tdee ========================================================

exports.saveTDEEData = async (req, res) => {
  try {
    const {
      patientId,
      age,
      height,
      weight,
      gender,
      heightunit,
      weightunit,
      name,
      activityLevel,
      tdeeScore,
    } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
        eerData: [],
        bmrData: [],
        bmiData: [],
        tdeeData: [],
        waterTracker: [],
      });
    }

    // Add the new TDEE data to the tdeeData array
    personalData.tdeeData.push({
      age,
      height,
      weight,
      gender,
      activityLevel,
      heightunit,
      weightunit,
      name,
      tdeeScore,
    });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "TDEE data saved successfully",
      data: personalData.tdeeData,
    });
  } catch (error) {
    console.error("Error saving TDEE data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while saving TDEE data",
      error,
    });
  }
};

exports.updateTDEEData = async (req, res) => {
  try {
    const { patientId, tdeeId } = req.body;
    const updateFields = req.body;

    const personalData = await PersonalData.findOne({
      patient: patientId,
    });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData or TDEE data not found",
      });
    }

    // personalData.tdeeData
    const tdeeDataToUpdate = personalData.tdeeData.find(
      (el) => el._id.toString() === tdeeId
    );

    if (!tdeeDataToUpdate) {
      return res.status(404).json({
        status: false,
        message: "Tdee data not found",
      });
    }

    tdeeDataToUpdate.age = updateFields.age
      ? updateFields.age
      : tdeeDataToUpdate.age;
    tdeeDataToUpdate.height = updateFields.height
      ? updateFields.height
      : tdeeDataToUpdate.height;
    tdeeDataToUpdate.weight = updateFields.weight
      ? updateFields.weight
      : tdeeDataToUpdate.weight;
    tdeeDataToUpdate.heightunit = updateFields.heightunit
      ? updateFields.heightunit
      : tdeeDataToUpdate.heightunit;
    tdeeDataToUpdate.weightunit = updateFields.weightunit
      ? updateFields.weightunit
      : tdeeDataToUpdate.weightunit;
    tdeeDataToUpdate.name = updateFields.name
      ? updateFields.name
      : tdeeDataToUpdate.name;
    tdeeDataToUpdate.gender = updateFields.gender
      ? updateFields.gender
      : tdeeDataToUpdate.gender;
    tdeeDataToUpdate.activityLevel = updateFields.activityLevel
      ? updateFields.activityLevel
      : tdeeDataToUpdate.activityLevel;
    tdeeDataToUpdate.tdeeScore = updateFields.tdeeScore
      ? updateFields.tdeeScore
      : tdeeDataToUpdate.tdeeScore;

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "TDEE data updated successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error updating TDEE data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the TDEE data",
      error,
    });
  }
};

exports.deleteTDEEData = async (req, res) => {
  try {
    const { patientId, tdeeId } = req.body;

    const personalData = await PersonalData.findOne({
      patient: patientId,
    });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData not found",
      });
    }

    // Find the index of the TDEE data to be removed
    const tdeeIndex = personalData.tdeeData.findIndex(
      (el) => el._id.toString() === tdeeId
    );

    if (tdeeIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "TDEE data not found",
      });
    }

    // Remove the TDEE data from the array
    personalData.tdeeData.splice(tdeeIndex, 1);

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "TDEE data deleted successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error deleting TDEE data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the TDEE data",
      error,
    });
  }
};

// water tracker ========================================================
exports.updateWaterTracker = async (req, res) => {
  try {
    const { patientId, trackerId } = req.body;
    const updateFields = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData or Water Tracker not found",
      });
    }

    const waterTrackerToUpdate = personalData.waterTracker.find(
      (el) => el._id.toString() === trackerId
    );

    if (!waterTrackerToUpdate) {
      return res.status(404).json({
        status: false,
        message: "Water Tracker not found",
      });
    }

    waterTrackerToUpdate.date = updateFields.date
      ? new Date(updateFields.date)
      : waterTrackerToUpdate.date;
    waterTrackerToUpdate.ounces = updateFields.ounces
      ? updateFields.ounces
      : waterTrackerToUpdate.ounces;
    waterTrackerToUpdate.glass = updateFields.glass
      ? updateFields.glass
      : waterTrackerToUpdate.glass;
    waterTrackerToUpdate.weight = updateFields.weight
      ? updateFields.weight
      : waterTrackerToUpdate.weight;
    waterTrackerToUpdate.name = updateFields.name
      ? updateFields.name
      : waterTrackerToUpdate.name;
    waterTrackerToUpdate.weightunit = updateFields.weightunit
      ? updateFields.weightunit
      : waterTrackerToUpdate.weightunit;

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "Water Tracker updated successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error updating Water Tracker:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the Water Tracker",
      error,
    });
  }
};

exports.deleteWaterTracker = async (req, res) => {
  try {
    const { patientId, trackerId } = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData not found",
      });
    }

    const trackerIndex = personalData.waterTracker.findIndex(
      (el) => el._id.toString() === trackerId
    );

    if (trackerIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "Water Tracker not found",
      });
    }

    personalData.waterTracker.splice(trackerIndex, 1);

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "Water Tracker deleted successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error deleting Water Tracker:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the Water Tracker",
      error,
    });
  }
};

exports.saveWaterTrackerData = async (req, res) => {
  try {
    const { patientId, ounces, glass, weight, name, weightunit } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
        eerData: [],
        bmrData: [],
        bmiData: [],
        tdeeData: [],
        waterTracker: [],
      });
    }

    // Add the new water tracker data to the waterTracker array
    personalData.waterTracker.push({ ounces, glass, name, weightunit, weight });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "Water tracker data saved successfully",
      data: personalData.waterTracker,
    });
  } catch (error) {
    console.error("Error saving water tracker data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while saving water tracker data",
      error,
    });
  }
};

// eer data ========================================================
exports.updateEERData = async (req, res) => {
  try {
    const { patientId, eerId } = req.body;
    const updateFields = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData or EER data not found",
      });
    }

    const eerDataToUpdate = personalData.eerData.find(
      (el) => el._id.toString() === eerId
    );

    if (!eerDataToUpdate) {
      return res.status(404).json({
        status: false,
        message: "EER data not found",
      });
    }

    eerDataToUpdate.age = updateFields.age
      ? updateFields.age
      : eerDataToUpdate.age;
    eerDataToUpdate.height = updateFields.height
      ? updateFields.height
      : eerDataToUpdate.height;
    eerDataToUpdate.weight = updateFields.weight
      ? updateFields.weight
      : eerDataToUpdate.weight;
    eerDataToUpdate.heightunit = updateFields.heightunit
      ? updateFields.heightunit
      : eerDataToUpdate.heightunit;
    eerDataToUpdate.weightunit = updateFields.weightunit
      ? updateFields.weightunit
      : eerDataToUpdate.weightunit;
    eerDataToUpdate.name = updateFields.name
      ? updateFields.name
      : eerDataToUpdate.name;
    eerDataToUpdate.gender = updateFields.gender
      ? updateFields.gender
      : eerDataToUpdate.gender;
    eerDataToUpdate.activityLevel = updateFields.activityLevel
      ? updateFields.activityLevel
      : eerDataToUpdate.activityLevel;
    eerDataToUpdate.totalEERScore = updateFields.totalEERScore
      ? updateFields.totalEERScore
      : eerDataToUpdate.totalEERScore;

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "EER data updated successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error updating EER data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the EER data",
      error,
    });
  }
};

exports.deleteEERData = async (req, res) => {
  try {
    const { patientId, eerId } = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData not found",
      });
    }

    const eerIndex = personalData.eerData.findIndex(
      (el) => el._id.toString() === eerId
    );

    if (eerIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "EER data not found",
      });
    }

    personalData.eerData.splice(eerIndex, 1);

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "EER data deleted successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error deleting EER data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the EER data",
      error,
    });
  }
};

exports.saveEERData = async (req, res) => {
  try {
    const {
      patientId,
      age,
      height,
      weight,
      heightunit,
      weightunit,
      name,
      gender,
      activityLevel,
      totalEERScore,
    } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
        eerData: [],
        bmrData: [],
        bmiData: [],
        tdeeData: [],
        waterTracker: [],
      });
    }

    // Add the new EER data to the eerData array
    personalData.eerData.push({
      age,
      height,
      weight,
      gender,
      activityLevel,
      totalEERScore,
      heightunit,
      weightunit,
      name,
    });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "EER data saved successfully",
      data: personalData.eerData,
    });
  } catch (error) {
    console.error("Error saving EER data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while saving EER data",
      error,
    });
  }
};

// bmr ========================================================
exports.updateBMRData = async (req, res) => {
  try {
    const { patientId, bmrId } = req.body;
    const updateFields = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData or BMR data not found",
      });
    }

    const bmrDataToUpdate = personalData.bmrData.find(
      (el) => el._id.toString() === bmrId
    );

    if (!bmrDataToUpdate) {
      return res.status(404).json({
        status: false,
        message: "BMR data not found",
      });
    }

    bmrDataToUpdate.age = updateFields.age
      ? updateFields.age
      : bmrDataToUpdate.age;
    bmrDataToUpdate.height = updateFields.height
      ? updateFields.height
      : bmrDataToUpdate.height;
    bmrDataToUpdate.weight = updateFields.weight
      ? updateFields.weight
      : bmrDataToUpdate.weight;
    bmrDataToUpdate.heightunit = updateFields.heightunit
      ? updateFields.heightunit
      : bmrDataToUpdate.heightunit;
    bmrDataToUpdate.weightunit = updateFields.weightunit
      ? updateFields.weightunit
      : bmrDataToUpdate.weightunit;
    bmrDataToUpdate.name = updateFields.name
      ? updateFields.name
      : bmrDataToUpdate.name;
    bmrDataToUpdate.gender = updateFields.gender
      ? updateFields.gender
      : bmrDataToUpdate.gender;
    bmrDataToUpdate.bmrScore = updateFields.bmrScore
      ? updateFields.bmrScore
      : bmrDataToUpdate.bmrScore;

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "BMR data updated successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error updating BMR data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the BMR data",
      error,
    });
  }
};

exports.deleteBMRData = async (req, res) => {
  try {
    const { patientId, bmrId } = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData not found",
      });
    }

    const bmrIndex = personalData.bmrData.findIndex(
      (el) => el._id.toString() === bmrId
    );

    if (bmrIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "BMR data not found",
      });
    }

    personalData.bmrData.splice(bmrIndex, 1);

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "BMR data deleted successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error deleting BMR data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the BMR data",
      error,
    });
  }
};

exports.saveBMRData = async (req, res) => {
  try {
    const {
      patientId,
      age,
      height,
      weight,
      gender,
      name,
      heightunit,
      weightunit,
      bmrScore,
    } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
        eerData: [],
        bmrData: [],
        bmiData: [],
        tdeeData: [],
        waterTracker: [],
      });
    }

    // Add the new BMR data to the bmrData array
    personalData.bmrData.push({
      age,
      height,
      weight,
      gender,
      name,
      heightunit,
      weightunit,
      bmrScore,
    });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "BMR data saved successfully",
      data: personalData.bmrData,
    });
  } catch (error) {
    console.error("Error saving BMR data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while saving BMR data",
      error,
    });
  }
};

// bmi ========================================================
exports.updateBMIData = async (req, res) => {
  try {
    const { patientId, bmiId } = req.body;
    const updateFields = req.body;

    const personalData = await PersonalData.findOne({
      patient: patientId,
    });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData or BMI data not found",
      });
    }

    const bmiDataToUpdate = personalData.bmiData.find(
      (el) => el._id.toString() === bmiId
    );

    if (!bmiDataToUpdate) {
      return res.status(404).json({
        status: false,
        message: "BMI data not found",
      });
    }

    for (let key in updateFields) {
      if (updateFields[key] !== undefined) {
        bmiDataToUpdate[key] = updateFields[key];
      }
    }

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "BMI data updated successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error updating BMI data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the BMI data",
      error,
    });
  }
};

exports.deleteBMIData = async (req, res) => {
  try {
    const { patientId, bmiId } = req.body;

    const personalData = await PersonalData.findOne({
      patient: patientId,
    });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "PersonalData not found",
      });
    }

    const bmiIndex = personalData.bmiData.findIndex(
      (el) => el._id.toString() === bmiId
    );

    if (bmiIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "BMI data not found",
      });
    }

    personalData.bmiData.splice(bmiIndex, 1);

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "BMI data deleted successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error deleting BMI data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting the BMI data",
      error,
    });
  }
};

exports.saveBMIData = async (req, res) => {
  try {
    const {
      patientId,
      age,
      height,
      weight,
      gender,
      bmiScore,
      name,
      heightunit,
      weightunit,
    } = req.body;

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
        eerData: [],
        bmrData: [],
        bmiData: [],
        tdeeData: [],
        waterTracker: [],
      });
    }

    // Add the new BMI data to the bmiData array
    personalData.bmiData.push({
      age,
      height,
      weight,
      gender,
      name,
      heightunit,
      weightunit,
      bmiScore,
    });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "BMI data saved successfully",
      data: personalData.bmiData,
    });
  } catch (error) {
    console.error("Error saving BMI data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while saving BMI data",
      error,
    });
  }
};

// weight ========================================================
exports.getWeightTrackers = async (req, res) => {
  try {
    const { patientId } = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "Personal data not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Weight trackers fetched successfully",
      data: personalData.weightTracker,
    });
  } catch (error) {
    console.error("Error fetching weight trackers:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the weight trackers",
      error,
    });
  }
};

exports.getSingleWeightTracker = async (req, res) => {
  try {
    const { patientId, weightTrackerId } = req.body;

    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "Personal data not found",
      });
    }

    const weightTracker = personalData.weightTracker.id(weightTrackerId);

    if (!weightTracker) {
      return res.status(404).json({
        status: false,
        message: "Weight tracker not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Weight tracker fetched successfully",
      data: weightTracker,
    });
  } catch (error) {
    console.error("Error fetching weight tracker:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching the weight tracker",
      error,
    });
  }
};

exports.createWeightData = async (req, res) => {
  try {
    const { patientId, weight, name, weightunit, age } = req.body;
    const date = new Date();

    let personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      personalData = new PersonalData({
        patient: patientId,
        weightTracker: [],
        kickCounts: [],
        eerData: [],
        bmrData: [],
        bmiData: [],
        tdeeData: [],
        waterTracker: [],
      });
    }

    personalData.weightTracker.push({ weight, name, age, weightunit, date });
    await personalData.save();

    res.status(201).json({
      status: true,
      message: "Weight data added successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error adding weight data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while adding weight data",
      error,
      data: error,
    });
  }
};

exports.deleteWeightData = async (req, res) => {
  try {
    const { patientId, weightId } = req.params;
    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({ message: "Personal data not found" });
    }

    personalData.weightTracker = personalData.weightTracker.filter(
      (weightRecord) => weightRecord._id.toString() !== weightId
    );

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "Weight data deleted successfully",
      data: personalData,
    });
  } catch (error) {
    console.error("Error deleting weight data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while deleting weight data",
      error,
      data: error,
    });
  }
};

exports.updateWeightTracker = async (req, res) => {
  const { patientId, weightId } = req.body;
  const { weight, name, age, date, weightunit } = req.body;

  try {
    const personalData = await PersonalData.findOne({ patient: patientId });

    if (!personalData) {
      return res.status(404).json({
        status: false,
        message: "Patient data not found",
      });
    }

    const weightTracker = personalData.weightTracker.id(weightId);
    if (!weightTracker) {
      return res.status(404).json({
        status: false,
        message: "Weight tracker entry not found",
      });
    }

    // Update weight tracker fields
    if (weight !== undefined) weightTracker.weight = weight;
    if (name !== undefined) weightTracker.name = name;
    if (age !== undefined) weightTracker.age = age;
    if (date !== undefined) weightTracker.date = date;
    if (weightunit !== undefined) weightTracker.weightunit = weightunit;

    await personalData.save();

    res.status(200).json({
      status: true,
      message: "Weight tracker data updated successfully",
      data: weightTracker,
    });
  } catch (error) {
    console.error("Error updating weight tracker data:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating weight tracker data",
      error,
    });
  }
};

// update profile =====================================================
exports.updatePatientProfile = async (req, res) => {
  const { id } = req.body;
  const { email, mobileno, firstName, lastName, username } = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(
      id,
      { email, mobileno, firstName, lastName, username },
      { new: true }
    );

    if (!patient) {
      return res
        .status(404)
        .json({ status: false, message: "Patient not found" });
    }

    res
      .status(200)
      .json({ status: true, data: patient, message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ status: false, message: "failed update", error });
  }
};

exports.getPatientProfile = async (req, res) => {
  const { id } = req.body;

  try {
    const patient = await Patient.findById(id).populate("admin createdby");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ status: true, message: "fetched", data: patient });
  } catch (error) {
    res.status(500).json({ status: false, message: "failed", error });
  }
};

exports.updateProfileImage = async (req, res) => {
  const { id } = req.body;

  try {
    if (!req.file) {
      return res
        .status(500)
        .json({ status: false, message: "No image file selected" });
    }
    // Find the patient
    const patient = await Patient.findById(id);
    if (!patient) {
      return res
        .status(404)
        .json({ status: false, message: "Patient not found" });
    }

    // If a previous image exists, remove it
    if (patient.image && patient.image !== "user-vector.png") {
      const oldImagePath = `uploads/profile/${patient.image}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update with the new image path
    patient.image = req.file.filename;
    await patient.save();

    res.status(200).json({
      status: true,
      message: "Profile image updated successfully",
      data: patient,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "failed to edit img", error });
  }
};

// ====================================================================
