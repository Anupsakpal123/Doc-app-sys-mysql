const jwt = require("jsonwebtoken");

/* =====================
   AUTH MIDDLEWARE
===================== */
function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 🔥 VERY IMPORTANT: req.user SET
    req.user = decoded; // { id, email, role }

    next();
  } catch (error) {
    console.error("AUTH ERROR 👉", error.message);
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
}

/* =====================
   DOCTOR ONLY
===================== */
function doctor(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorized",
    });
  }

  if (req.user.role === "Doctor") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      msg: "Doctor access only",
    });
  }
}

/* =====================
   ADMIN ONLY
===================== */
function admin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      msg: "Unauthorized",
    });
  }

  if (req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      msg: "Admin access only",
    });
  }
}

module.exports = { auth, doctor, admin };
