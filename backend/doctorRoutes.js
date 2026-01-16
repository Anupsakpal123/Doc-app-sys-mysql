const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  applyDoctor,
  getMyDoctorRequest,
} = require("../controllers/doctorController");

router.post("/apply", auth, applyDoctor);
router.get("/my-request", auth, getMyDoctorRequest);

module.exports = router;
