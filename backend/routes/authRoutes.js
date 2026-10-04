const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const {
  sendPasswordResetEmail,
} = require("../services/emailService");


const router = express.Router();


/* =====================================
   REGISTER
===================================== */

router.post("/register", async (req, res) => {
  try {
    let {
      name,
      email,
      phone,
      password,
    } = req.body;


    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }


    name = String(name).trim();
    email = String(email).trim().toLowerCase();
    phone = String(phone).trim();
    password = String(password);


    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }


    const existingUser = await User.findOne({
      email,
    });


    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }


    const user = await User.create({
      name,
      email,
      phone,

      // Plain text during development only
      password,
    });


    res.status(201).json({
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});


/* =====================================
   LOGIN
===================================== */

router.post("/login", async (req, res) => {
  try {
    let {
      email,
      password,
    } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }


    email = String(email).trim().toLowerCase();
    password = String(password);


    const user = await User.findOne({
      email,
    });


    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    if (password !== user.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is not configured"
      );

      return res.status(500).json({
        message: "Server configuration error",
      });
    }


    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});


/* =====================================
   CURRENT USER
===================================== */

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    res.status(200).json({
      user,
    });

  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});


/* =====================================
   FORGOT PASSWORD
===================================== */

router.post(
  "/forgot-password",
  async (req, res) => {
    try {
      const {
        email,
      } = req.body;


      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }


      const normalizedEmail = String(
        email
      )
        .trim()
        .toLowerCase();


      const user = await User.findOne({
        email: normalizedEmail,
      });


      /*
       * Keep the same response whether
       * the account exists or not.
       * This prevents email enumeration.
       */

      if (!user) {
        return res.status(200).json({
          message:
            "If an account exists with this email, a password reset link has been sent.",
        });
      }


      const resetToken = crypto
        .randomBytes(32)
        .toString("hex");


      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");


      user.resetPasswordToken =
        hashedToken;

      user.resetPasswordExpires =
        Date.now() + 15 * 60 * 1000;


      await user.save();


      await sendPasswordResetEmail({
        customerName: user.name,
        customerEmail: user.email,
        resetToken,
      });


      res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );


      res.status(500).json({
        message:
          "Unable to process password reset request",
      });
    }
  }
);


/* =====================================
   RESET PASSWORD
===================================== */

router.post(
  "/reset-password",
  async (req, res) => {
    try {
      const {
        token,
        newPassword,
      } = req.body;


      if (!token || !newPassword) {
        return res.status(400).json({
          message:
            "Token and new password are required",
        });
      }


      const password =
        String(newPassword);


      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters",
        });
      }


      const hashedToken = crypto
        .createHash("sha256")
        .update(String(token))
        .digest("hex");


      const user = await User.findOne({
        resetPasswordToken: hashedToken,

        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });


      if (!user) {
        return res.status(400).json({
          message:
            "Reset link is invalid or has expired",
        });
      }


      // Plain text during development only
      user.password = password;


      // Reset link can only be used once
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;


      await user.save();


      res.status(200).json({
        message:
          "Password reset successfully. You can now login with your new password.",
      });

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );


      res.status(500).json({
        message:
          "Unable to reset password",
      });
    }
  }
);


module.exports = router;