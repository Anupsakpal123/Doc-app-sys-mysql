const User = require("./userModel");
const Appointment = require("./Appointmentmodel");
const DoctorRequest = require("./DoctorRequest");

/* Appointment relations */
Appointment.belongsTo(User, {
  foreignKey: "createdBy",
  as: "patient",
});

Appointment.belongsTo(User, {
  foreignKey: "doctorId",
  as: "doctor",
});

/* ✅ Doctor Request relation */
DoctorRequest.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(DoctorRequest, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Appointment,
  DoctorRequest,
};
