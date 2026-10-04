const express = require("express");

const Inspection = require("../models/Inspection");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const cloudinary = require("../config/cloudinary");
const reportUpload = require("../middleware/reportUploadMiddleware");
const {sendReportReadyEmail,} = require("../services/emailService");
const Payment = require("../models/Payment");
const {sendPaymentApprovedEmail, sendPaymentRejectedEmail,} = require("../services/emailService");

const router = express.Router();

const uploadReportToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "gaaricheck/reports",
          resource_type: "raw",
          format: "pdf",
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    uploadStream.end(file.buffer);
  });
};

// Get all inspections for admin
router.get(
  "/inspections",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const inspections = await Inspection.find()
        .populate("user", "name email phone")
        .sort({
          createdAt: -1,
        });

      res.status(200).json({
        inspections,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Unable to load inspections",
      });
    }
  }
);

router.get(
  "/inspections/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const inspection = await Inspection.findById(
        req.params.id
      ).populate("user", "name email phone");

      if (!inspection) {
        return res.status(404).json({
          message: "Inspection not found",
        });
      }

      res.status(200).json({
        inspection,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Unable to load inspection",
      });
    }
  }
);

router.patch(
  "/inspections/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Submitted",
        "Under Review",
        "Inspection In Progress",
        "Report Ready",
        "Completed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid inspection status",
        });
      }

      const inspection = await Inspection.findById(
        req.params.id
      );

      if (!inspection) {
        return res.status(404).json({
          message: "Inspection not found",
        });
      }

      inspection.status = status;

      await inspection.save();

      res.status(200).json({
        message: "Inspection status updated successfully",
        inspection,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Unable to update inspection status",
      });
    }
  }
);

router.post(
  "/inspections/:id/report",
  protect,
  adminOnly,
  reportUpload.single("report"),

  async (req, res) => {
    try {
      const inspection = await Inspection.findById(
        req.params.id
      );

      if (!inspection) {
        return res.status(404).json({
          message: "Inspection not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please select a PDF report",
        });
      }

      const result =
        await uploadReportToCloudinary(req.file);

      inspection.reportUrl = result.secure_url;

      inspection.reportPublicId =
        result.public_id;

      inspection.reportOriginalName =
        req.file.originalname;

      inspection.reportUploadedAt =
        new Date();

      inspection.status = "Report Ready";

      await inspection.save();

      try {
  await sendReportReadyEmail({
    customerName: inspection.customer.name,

    customerEmail:
      inspection.customer.email,

    inspectionNumber:
      inspection.inspectionNumber,

    vehicle:
      inspection.vehicle,
  });
} catch (emailError) {
  console.log(
    "Email notification failed:",
    emailError.message
  );
}

      res.status(200).json({
        message:
          "Inspection report uploaded successfully",

        reportUrl: inspection.reportUrl,

        inspection,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          error.message ||
          "Unable to upload inspection report",
      });
    }
  }
);

/* =====================================
   ADMIN - ALL PAYMENTS
===================================== */

router.get(
  "/payments",
  protect,
  adminOnly,

  async (req, res) => {
    try {
      const payments =
        await Payment.find()
          .populate(
            "user",
            "name email phone"
          )
          .populate(
            "verifiedBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        payments,
      });

    } catch (error) {
      console.error(
        "Admin payments error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load payments.",
      });
    }
  }
);


/* =====================================
   ADMIN - APPROVE / REJECT
===================================== */

router.patch(
  "/payments/:id/status",
  protect,
  adminOnly,

  async (req, res) => {
    try {
      const {
        status,
        rejectionReason,
      } = req.body;

      if (
        ![
          "Approved",
          "Rejected",
        ].includes(status)
      ) {
        return res.status(400).json({
          message:
            "Status must be Approved or Rejected.",
        });
      }
        const payment =
        await Payment.findById(
            req.params.id
        ).populate(
            "user",
            "name email"
        );

      if (!payment) {
        return res.status(404).json({
          message:
            "Payment not found.",
        });
      }

      if (
        payment.inspectionCreated &&
        status === "Rejected"
      ) {
        return res.status(400).json({
          message:
            "This payment has already been used for an inspection.",
        });
      }

      payment.status = status;

      payment.verifiedAt =
        new Date();

      payment.verifiedBy =
        req.user.id;

      if (
        status === "Rejected"
      ) {
        payment.rejectionReason =
          rejectionReason ||
          "Payment could not be verified.";
      } else {
        payment.rejectionReason =
          null;
      }

      await payment.save();

        try {
    if (
        status === "Approved"
    ) {
        await sendPaymentApprovedEmail({
        to: payment.user.email,

        customerName:
            payment.user.name,

        plan:
            payment.plan,

        amount:
            payment.amount,

        paymentId:
            payment._id,
        });
    }

    if (
        status === "Rejected"
    ) {
        await sendPaymentRejectedEmail({
        to: payment.user.email,

        customerName:
            payment.user.name,

        plan:
            payment.plan,

        rejectionReason:
            payment.rejectionReason,
        });
    }

    } catch (emailError) {
    console.error(
        "Payment email error:",
        emailError
    );
    }

      res.json({
        message:
          `Payment ${status.toLowerCase()} successfully.`,

        payment,
      });

    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to update payment.",
      });
    }
  }
);

module.exports = router;