const express = require("express");
const router = express.Router();

const userlogincontroller = require("../controllers/userLoginCtrl");

//============================= login ====================================================
router.post("/login", userlogincontroller.userlogin);
router.post("/logout", userlogincontroller.userlogout);
router.post("/logout/doctor", userlogincontroller.doclogout);

router.post("/login/doctor", userlogincontroller.DoctorLogin);

// =======================================================================================

module.exports = router;
