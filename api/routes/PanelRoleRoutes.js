const express = require("express");
const router = express.Router();
const rolecontroller = require("../controllers/PanelRoleCtrl");
const multer = require("multer");
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

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profileform/"); // Save uploaded images to the uploads folder
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

const uploadform = multer({ storage: storage2 });

// admin

router.post("/addAdmin", rolecontroller.addAdmin);

router.get("/getadmins", rolecontroller.getalladmins);

router.put("/edit/:adminId", rolecontroller.editAdminDetails);

router.put("/block", rolecontroller.blockOrUnblockAdmin);

// consultant

router.post("/addconsultant", rolecontroller.addConsultant);

router.get("/getconsultants", rolecontroller.getallConsultant);

router.put(
  "/edit/consultant/:consultantId",
  rolecontroller.editConsultantDetails
);

router.put("/block/consultant", rolecontroller.blockOrUnblockConsultant);

// doctor

router.post("/adddoctor", rolecontroller.addDoctor);

router.get("/getdoctors", rolecontroller.getallDoctor);

router.put("/edit/doctor/:doctorId", rolecontroller.editDoctorDetails);

router.put("/block/doctor", rolecontroller.blockOrUnblockDoctor);

// Patient

router.post("/addpatient", upload.single("photo"), rolecontroller.addPatient);

router.get("/getpatients", rolecontroller.getallPatient);
router.post("/getallpatients", rolecontroller.getallPatientwopagination);
// getallPatientwopagination

router.put(
  "/edit/patient/:patientId",
  upload.single("photo"),
  rolecontroller.editPatientDetails
);

router.put("/block/patient", rolecontroller.blockOrUnblockPatient);

// update role profile details

router.post(
  "/updateroleprofile",
  // uploadform.single("photo"),
  rolecontroller.updateRoleProfile
);

router.post("/updateprofileDetails", rolecontroller.updateProfiledetails);

router.post(
  "/uploadprofilepic",
  upload.single("image"),
  rolecontroller.updateProfilepic
);

router.get("/getprofile", rolecontroller.getProfile);

// get permissions
router.post("/getpermissions", rolecontroller.getpermissions);

router.post("/search", rolecontroller.search);

// updateProfiledetails

// appointments =========================================================================
router.put("/appointments/status", userctrl.updateAppointmentStatus);

// Route to update the date and concern of an appointment
router.put("/appointments/update", userctrl.updateAppointmentDateAndConcern);

// Route to get all appointments for doctor or patient
router.post("/appointments", userctrl.getAllAppointmentswpage);

router.post("/create/appointments", userctrl.createAppointment);

module.exports = router;
