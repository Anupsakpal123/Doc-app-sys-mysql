const express = require("express");
const { auth } = require("../middleware/auth");
const { getUserNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", auth, getUserNotifications);

module.exports = router;
