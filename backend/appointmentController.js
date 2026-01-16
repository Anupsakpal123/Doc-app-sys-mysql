const Appointment = require("../models/Appointmentmodel");
const User = require("../models/userModel");

/* ===============================
   CREATE APPOINTMENT (USER)
================================ */
const createAppointment = async (req, res) => {
  try {
    const { dateTime, doctorId } = req.body;

    if (!dateTime || !doctorId) {
      return res.status(400).send({
        success: false,
        msg: "Date & Doctor are required",
      });
    }

    const appointment = await Appointment.create({
      dateTime,
      doctorId,
      createdBy: req.user.id,
    });

    return res.status(200).send({
      success: true,
      msg: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR 👉", error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
};

/* ===============================
   GET USER APPOINTMENTS
================================ */
const getAppointmentsByUser = async (req, res) => {
  try {
    console.log("USER ID 👉", req.user.id);

    const appointments = await Appointment.findAll({
      where: { createdBy: req.user.id },
      include: [
        {
          model: User,
          as: "doctor",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("GET USER APPOINTMENTS ERROR 👉", error);
    return res.status(500).send({
      success: false,
      msg: "Server error",
    });
  }
};
/* ===============================
   GET DOCTOR APPOINTMENTS
================================ */
const showAppointmentsOfDoctor = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.id },
      include: [
        { model: User, as: "patient", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("GET DOCTOR APPOINTMENTS ERROR 👉", error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
};

/* ===============================
   GET ALL APPOINTMENTS (ADMIN)
================================ */
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: "patient", attributes: ["id", "name"] },
        { model: User, as: "doctor", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).send({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("ALL APPOINTMENTS ERROR", error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
};


/* ================= UPDATE ================= */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dateTime, doctorId } = req.body;

    const updated = await Appointment.update(
      { dateTime, doctorId },
      { where: { id } }
    );

    if (updated[0] === 0) {
      return res.status(404).send({ success: false, msg: "Not updated" });
    }

    res.send({ success: true, msg: "Appointment updated" });
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server error" });
  }
};

/* ================= DELETE ================= */
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Appointment.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send({ success: false, msg: "Not deleted" });
    }

    res.send({ success: true, msg: "Appointment deleted" });
  } catch (error) {
    res.status(500).send({ success: false, msg: "Server error" });
  }
};





/* ===============================
   UPDATE STATUS (DOCTOR)
================================ */
const statusUpdateByDoctor = async (req, res) => {
  try {
    const { ID } = req.params;
    const { status } = req.body;

    const updated = await Appointment.update(
      {
        status,
        updatedBy: req.user.id,
      },
      { where: { id: ID } }
    );

    if (updated[0] === 0) {
      return res.status(400).send({
        success: false,
        msg: "Appointment not updated",
      });
    }

    return res.status(200).send({
      success: true,
      msg: "Appointment status updated",
    });
  } catch (error) {
    console.error("STATUS UPDATE ERROR 👉", error);
    res.status(500).send({ success: false, msg: "Server error" });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  getAllAppointments,
  statusUpdateByDoctor,
};
