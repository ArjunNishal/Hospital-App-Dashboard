const express = require("express");
const router = express.Router();
const multer = require("multer");
const aboutcontroller = require("../controllers/AboutusCtrl");
const blogController = require("../controllers/BlogsCtrl");
const userctrl = require("../controllers/userCtrl");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile/"); // Save uploaded images to the uploads folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage: storage });

// query =================================================================================

router.post("/addquery", aboutcontroller.createQuery);

//============================= blogs ====================================================
router.get(
  "/get/categories/user/:adminId",
  blogController.getCategoriesByAdminwoPagination
);

router.get("/get/blogs/user/:adminId", blogController.getAllBlogswopagination);
router.get("/getblog/:id", blogController.getBlogById);

router.put("/blogs/:id/like", blogController.likeBlog);

router.get("/blogs/liked", blogController.getLikedBlogs);

router.get("/blogs/category/:categoryId", userctrl.getBlogsByCategory);

router.get("/allblogs", userctrl.getallblogsAndCatAndLiked);
// getallblogsAndCatAndLiked
// =======================================================================================

// about us and privacy ==================================================================

router.get("/get/aboutus", aboutcontroller.getaboutus);
router.get("/get/privacy-policy", aboutcontroller.getPrivacyPolicy);
router.get("/get/terms", aboutcontroller.getterms);
// =======================================================================================

// notes =================================================================================

router.post("/add/diary", userctrl.addDiaryEntry);
router.post("/edit/diary", userctrl.editDiaryEntry);
router.delete("/delete/diary/:id", userctrl.deleteDiaryEntry);
router.get("/get/diary", userctrl.getDiaryEntries);
router.post("/get/diary/date", userctrl.getDiaryEntryByDate);

// =========================================================================================

// home api ================================================================================

router.post("/home", userctrl.homeapi);
// =========================================================================================

// week ====================================================================================

router.get("/weekdata/:weekMasterId", userctrl.getWeekDataByWeekMasterId);

router.get("/weeks/active", userctrl.getActiveWeeks);

// =========================================================================================

// personsel data ==========================================================================

router.post("/get_history", userctrl.getPersonalData);
router.post("/save-dates", userctrl.savedates);
// kick
router.post("/createKickCountData", userctrl.createKickCountData);
router.post("/get_kick_counter", userctrl.getkickcounter);
router.post("/edit_kick_counter", userctrl.editkickcounter);
router.post("/delete_kick_counter", userctrl.deleteKickCount);

// water
router.post("/save-water-tracker-data", userctrl.saveWaterTrackerData);
router.put("/edit_water_data", userctrl.updateWaterTracker);
router.delete("/delete_water_data", userctrl.deleteWaterTracker);

// tdee
router.post("/save-tdee-data", userctrl.saveTDEEData);
router.put("/edit_tdee_data", userctrl.updateTDEEData);
router.delete("/delete_tdee_data", userctrl.deleteTDEEData);

// eer
router.put("/edit_eer_data", userctrl.updateEERData);
router.delete("/delete_eer_data", userctrl.deleteEERData);
router.post("/save-eer-data", userctrl.saveEERData);

// bmr
router.put("/edit_bmr_data", userctrl.updateBMRData);
router.delete("/delete_bmr_data", userctrl.deleteBMRData);
router.post("/save-bmr-data", userctrl.saveBMRData);

// bmi
router.put("/edit_bmidata", userctrl.updateBMIData);
router.delete("/delete_bmidata", userctrl.deleteBMIData);
router.post("/save-bmi-data", userctrl.saveBMIData);

// weight tracker
router.post("/add/personaldata/weight", userctrl.createWeightData);
router.delete(
  "/delete/personaldata/weight/:patientId/:weightId",
  userctrl.deleteWeightData
);

router.post("/get_weight_trackers", userctrl.getWeightTrackers);

router.post("/get_single_weight_tracker", userctrl.getSingleWeightTracker);

router.put("/edit_weighttracker", userctrl.updateWeightTracker);

// =========================================================================================

// appointments =========================================================================
router.put("/appointments/status", userctrl.updateAppointmentStatus);

// Route to update the date and concern of an appointment
router.put("/appointments/update", userctrl.updateAppointmentDateAndConcern);

// Route to get all appointments for doctor or patient
router.post("/appointments", userctrl.getAllAppointments);

router.post("/create/appointments", userctrl.createAppointment);
// ======================================================================================

// password change
router.post("/resetpassword/:id/:token", userctrl.resetpass);
// =======================================================================================

//update profile of doctor or patient
router.put("/updatepatient", userctrl.updatePatientProfile);

router.put(
  "/updatepatient/profileimg",
  upload.single("image"),
  userctrl.updateProfileImage
);

router.post("/getpatient/single", userctrl.getPatientProfile);

module.exports = router;
