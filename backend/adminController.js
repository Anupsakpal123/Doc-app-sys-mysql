const DoctorRequest = require("../models/DoctorRequest");
const User = require("../models/userModel");

/* GET ALL DOCTOR REQUESTS */
const getDoctorRequests = async (req, res) => {
  try {
    const requests = await DoctorRequest.findAll({
      where: { status: "Pending" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

/* APPROVE / REJECT */
const updateDoctorRequest = async (req, res) => {
  const { id, status } = req.body;

  const request = await DoctorRequest.findByPk(id);
  if (!request) return res.status(404).json({ msg: "Request not found" });

  request.status = status;
  await request.save();

  if (status === "Approved") {
    await User.update(
      { role: "Doctor" },
      { where: { id: request.userId } }
    );
  }

  res.json({ success: true, msg: `Request ${status}` });
};

module.exports = {
  getDoctorRequests,
  updateDoctorRequest,
};
