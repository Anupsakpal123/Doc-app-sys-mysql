const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController"); // ✅ FIX
const { auth, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUserinfo", auth, userController.getUserInfo);
router.get("/doctorlist", userController.doctorList);
router.get("/allUsers", auth, admin, userController.getAllUsers);

// ✅ PROFILE IMAGE UPLOAD
router.post(
  "/uploadProfile",
  auth,
  upload.single("image"),
  userController.uploadProfile
);

module.exports = router;
