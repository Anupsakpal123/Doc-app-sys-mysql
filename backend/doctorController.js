const DoctorRequest = require("../models/DoctorRequest");
const User = require("../models/userModel");

/* =========================
   USER → APPLY DOCTOR
========================= */
const applyDoctor = async (req, res) => {
  try {
    const { specialist, fees } = req.body;

    // 🔒 validation
    if (!specialist || !fees) {
      return res.status(400).json({
        success: false,
        msg: "Specialist and fees are required",
      });
    }

    // 🔒 already applied check
    const existing = await DoctorRequest.findOne({
      where: { userId: req.user.id },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        msg: "You have already applied for doctor",
      });
    }

    // ✅ create doctor request
    await DoctorRequest.create({
      userId: req.user.id,
      specialist,
      fees,
      status: "Pending",
    });

    return res.status(200).json({
      success: true,
      msg: "Doctor request submitted successfully",
    });
  } catch (error) {
    console.error("APPLY DOCTOR ERROR 👉", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

/* =========================
   USER → GET MY REQUEST
========================= */
const getMyDoctorRequest = async (req, res) => {
  try {
    const request = await DoctorRequest.findOne({
      where: { userId: req.user.id },
    });

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("GET MY REQUEST ERROR 👉", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

/* =========================
   ADMIN → GET ALL REQUESTS
========================= */
const getDoctorRequests = async (req, res) => {
  try {
    const requests = await DoctorRequest.findAll({
      include: [
        {
          model: User,
          as: "user", // 🔥 VERY IMPORTANT
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("GET DOCTOR REQUESTS ERROR 👉", error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
/* =========================
   ADMIN → APPROVE / REJECT
========================= */
const updateDoctorStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({
        success: false,
        msg: "Request ID and status are required",
      });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status value",
      });
    }

    const request = await DoctorRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        msg: "Request not found",
      });
    }

    // update request status
    request.status = status;
    await request.save();

    // 🔥 role update on approval
    if (status === "Approved") {
      await User.update(
        { role: "Doctor" },
        { where: { id: request.userId } }
      );
    }

    return res.status(200).json({
      success: true,
      msg: `Request ${status} successfully`,
    });
  } catch (error) {
    console.error("UPDATE DOCTOR STATUS ERROR 👉", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

module.exports = {
  applyDoctor,
  getMyDoctorRequest,     // ✅ IMPORTANT
  getDoctorRequests,
  updateDoctorStatus,
};
