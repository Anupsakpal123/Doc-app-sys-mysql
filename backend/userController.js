const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ===================== REGISTER ===================== */
const register = async (req, res) => {
  try {
    const { name, email, password, contactNumber, address } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        msg: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      address,
    });

    return res.status(200).send({
      success: true,
      msg: "Register successfully",
    });
  } catch (error) {
    console.error("REGISTER ERROR 👉", error);
    res.status(500).send({ msg: "Server error", success: false });
  }
};

/* ===================== LOGIN ===================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loggedUser = await User.findOne({ where: { email } });

    if (!loggedUser) {
      return res.status(400).send({
        success: false,
        msg: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, loggedUser.password);

    if (!isMatch) {
      return res.status(400).send({
        success: false,
        msg: "Password incorrect",
      });
    }

    const payload = {
      id: loggedUser.id,
      email: loggedUser.email,
      role: loggedUser.role,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      success: true,
      msg: "Logged in successfully",
      token,
      user: {
        id: loggedUser.id,
        name: loggedUser.name,
        email: loggedUser.email,
        role: loggedUser.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR 👉", error);
    res.status(500).send({ msg: "Server error", success: false });
  }
};

/* ===================== GET LOGGED USER ===================== */
const getUserInfo = async (req, res) => {
  try {
    const loggedUser = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "name",
        "email",
        "address",
        "role",
        "profileImage",
      ],
    });

    return res.status(200).send({
      success: true,
      user: loggedUser,
    });
  } catch (error) {
    console.error("GET USER INFO ERROR 👉", error);
    res.status(500).send({ msg: "Server error", success: false });
    console.log("LOGIN USER ID 👉", loggedUser.id, "ROLE 👉", loggedUser.role);
  }
};

/* ===================== UPLOAD PROFILE IMAGE ===================== */
const uploadProfile = async (req, res) => {
  try {
    console.log("AUTH USER 👉", req.user); // must have email

    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "No file uploaded",
      });
    }

    const [updatedRows] = await User.update(
      { profileImage: req.file.filename },
      { where: { email: req.user.email } } // 🔥 KEY FIX
    );

    console.log("UPDATED ROWS 👉", updatedRows);

    if (updatedRows === 0) {
      return res.status(400).json({
        success: false,
        msg: "Profile image not updated",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Profile image uploaded successfully",
      file: req.file.filename,
    });
  } catch (error) {
    console.error("UPLOAD PROFILE ERROR 👉", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


/* ===================== DOCTOR LIST ===================== */
const doctorList = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: "Doctor" },
      attributes: ["id", "name"],
    });

    return res.status(200).send({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("DOCTOR LIST ERROR 👉", error);
    res.status(500).send({ msg: "Server error", success: false });
  }
};

/* ===================== ALL USERS (ADMIN) ===================== */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({
      success: true,
      users,
    });
  } catch (error) {
    console.error("ALL USERS ERROR 👉", error);
    res.status(500).send({ msg: "Server error", success: false });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  uploadProfile,   // ✅ NEW
  doctorList,
  getAllUsers,
};
