const express = require("express");
const router = express.Router();

const logincontroller = require("../controllers/PanelLoginCtrl");
const userctrl = require("../controllers/userCtrl");
const authenticate = require("../middlewares/auth");

router.post("/login-superadmin", logincontroller.superLogin);
router.post("/login-admin", logincontroller.AdminLogin);
router.post("/login-consultant", logincontroller.ConsultantLogin);
router.post("/login-doctor", logincontroller.DoctorLogin);

router.post("/resetpassword", authenticate, logincontroller.forgotpassword);

// reset passsword =================================================================
router.put(
  "/resetpassword/:id/:token",
  authenticate,
  logincontroller.resetpass
);

router.post(
  "/doctor/resetpassword/:id/:token",
  authenticate,
  userctrl.resetpass
);

router.post("/unauth/resetpassword", logincontroller.forgotpassword);

// reset passsword =================================================================
router.put("/unauth/resetpassword/:id/:token", logincontroller.resetpass);

module.exports = router;
