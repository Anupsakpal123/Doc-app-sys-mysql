const Notification = require("../models/Notification");

const getUserNotifications = async (req, res) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.json({ success: true, notifications });
};

module.exports = { getUserNotifications };
