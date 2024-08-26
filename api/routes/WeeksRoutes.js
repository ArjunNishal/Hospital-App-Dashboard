// routes/weekRoutes.js
const express = require("express");
const router = express.Router();
const weekController = require("../controllers/WeeksCtrl");
// const upload = require("../config/multerConfig");

const multer = require("multer");
const path = require("path");

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/weeks/");
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

// Initialize multer with storage
const upload = multer({ storage: storage });

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/weeks/"); // Save uploaded images to the uploads folder
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

const upload2 = multer({ storage: storage2 });

router.post(
  "/createweek",
  upload.fields([
    { name: "babyImage", maxCount: 1 },
    { name: "momImage", maxCount: 1 },
  ]),
  weekController.createWeek
);

router.get("/getweek/admin/:adminId", weekController.getWeeksByAdminId);

// Get single week data by ID
router.get("/getweek/:id", weekController.getWeekById);

// Get all weeks data
router.get("/getweeks", weekController.getAllWeeks);

router.get(
  "/validate/week/:number/:adminId",
  weekController.validateweeknumber
);

router.patch("/updateweek/:id/status", weekController.updateWeekStatus);

router.put(
  "/updateweek/:id",
  upload.fields([
    { name: "babyImage", maxCount: 1 },
    { name: "momImage", maxCount: 1 },
  ]),
  weekController.updateWeek
);

router.post(
  "/upload/image",
  // upload.single("upload"),
  upload2.array("files"),
  weekController.uploadImage
);

// week master

// Category Routes
router.post("/create/masterweek", weekController.createmasterweek);
router.put("/edit/masterweek/:id", weekController.updatemasterweek);
router.put(
  "/edit/masterweek/:id/status",
  weekController.updatemasterweekStatus
);
router.get("/get/masterweeks", weekController.getAllmasterweeks);

module.exports = router;
