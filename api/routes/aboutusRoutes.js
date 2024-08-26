const express = require("express");
const router = express.Router();

const aboutcontroller = require("../controllers/AboutusCtrl");

router.put("/edit/aboutus", aboutcontroller.editaboutus);

router.get("/get/aboutus", aboutcontroller.getaboutus);

router.put("/edit/terms", aboutcontroller.editterms);

router.get("/get/terms", aboutcontroller.getterms);

router.get("/get/privacy-policy", aboutcontroller.getPrivacyPolicy);

router.put("/edit/privacy-policy", aboutcontroller.editPrivacyPolicy);

router.post("/addquery", aboutcontroller.createQuery);
router.get("/allquery", aboutcontroller.getAllQueries);
router.get("/queries/admin/:id", aboutcontroller.getQueriesByAdmin);
router.post(
  "/status/query/:queryId",

  aboutcontroller.changeQueryStatus
);

module.exports = router;
