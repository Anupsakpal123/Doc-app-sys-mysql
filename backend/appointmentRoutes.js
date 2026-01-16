const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { auth, doctor, admin } = require("../middleware/auth");

router.post("/createAppoint", auth, appointmentController.createAppointment);

router.get(
  "/getAppointmentsByUser",
  auth,
  appointmentController.getAppointmentsByUser
);

router.get(
  "/showAppointmentsOfDoctor",
  auth,
  doctor,
  appointmentController.showAppointmentsOfDoctor
);

router.get(
  "/allAppointments",
  auth,
  admin,
  appointmentController.getAllAppointments
);

router.patch(
  "/statusUpdateByDoctor/:ID",
  auth,
  doctor,
  appointmentController.statusUpdateByDoctor
);

module.exports = router;
