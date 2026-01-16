const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/auth");
const {
  getDoctorRequests,
  updateDoctorStatus,
} = require("../controllers/doctorController");

router.get("/doctor-requests", auth, admin, getDoctorRequests);
router.patch("/doctor-requests", auth, admin, updateDoctorStatus);

module.exports = router;
