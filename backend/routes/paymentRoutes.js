const express = require("express");

const router = express.Router();

const Payment = require("../models/Payment");

const protect =
  require("../middleware/authMiddleware");

const cloudinary =
  require("../config/cloudinary");

const paymentReceiptUpload =
  require("../middleware/paymentReceiptUpload");


const PLAN_PRICES = {
  basic: 2999,
  standard: 4999,
  premium: 7999,
};


/* =====================================
   CLOUDINARY RECEIPT UPLOAD
===================================== */

const uploadReceiptToCloudinary = (
  fileBuffer
) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              "gaaricheck/payments",

            resource_type:
              "image",
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      uploadStream.end(
        fileBuffer
      );
    }
  );
};


/* =====================================
   PAYMENT METHODS
===================================== */

router.get(
  "/methods",
  protect,
  async (req, res) => {
    res.json({
      plans: PLAN_PRICES,

      methods: {
        JazzCash: {
          accountNumber:
            process.env
              .PAYMENT_JAZZCASH_NUMBER,

          accountName:
            process.env
              .PAYMENT_JAZZCASH_NAME,
        },

        Easypaisa: {
          accountNumber:
            process.env
              .PAYMENT_EASYPAISA_NUMBER,

          accountName:
            process.env
              .PAYMENT_EASYPAISA_NAME,
        },

        "Bank Transfer": {
          bankName:
            process.env
              .PAYMENT_BANK_NAME,

          accountTitle:
            process.env
              .PAYMENT_BANK_ACCOUNT_TITLE,

          accountNumber:
            process.env
              .PAYMENT_BANK_ACCOUNT_NUMBER,

          iban:
            process.env
              .PAYMENT_BANK_IBAN,
        },
      },
    });
  }
);


/* =====================================
   SUBMIT PAYMENT
===================================== */

router.post(
  "/",
  protect,
  paymentReceiptUpload.single(
    "receipt"
  ),

  async (req, res) => {
    try {
      const {
        plan,
        paymentMethod,
        transactionId,
      } = req.body;

      if (
        !plan ||
        !paymentMethod ||
        !transactionId
      ) {
        return res.status(400).json({
          message:
            "Plan, payment method and transaction ID are required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message:
            "Payment receipt is required.",
        });
      }

      if (!PLAN_PRICES[plan]) {
        return res.status(400).json({
          message:
            "Invalid inspection package.",
        });
      }

      const allowedMethods = [
        "JazzCash",
        "Easypaisa",
        "Bank Transfer",
      ];

      if (
        !allowedMethods.includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid payment method.",
        });
      }

      const duplicate =
        await Payment.findOne({
          paymentMethod,
          transactionId:
            transactionId.trim(),
        });

      if (duplicate) {
        return res.status(400).json({
          message:
            "This transaction ID has already been submitted.",
        });
      }

      const uploadedReceipt =
        await uploadReceiptToCloudinary(
          req.file.buffer
        );

      const payment =
        await Payment.create({
          user: req.user.id,

          plan,

          amount:
            PLAN_PRICES[plan],

          paymentMethod,

          transactionId:
            transactionId.trim(),

          receiptUrl:
            uploadedReceipt.secure_url,

          receiptPublicId:
            uploadedReceipt.public_id,

          receiptOriginalName:
            req.file.originalname,

          status: "Pending",
        });

      res.status(201).json({
        message:
          "Payment submitted successfully and is pending verification.",

        payment,
      });

    } catch (error) {
      console.error(
        "Payment submit error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to submit payment.",
      });
    }
  }
);


/* =====================================
   MY PAYMENTS
===================================== */

router.get(
  "/my",
  protect,
  async (req, res) => {
    try {
      const payments =
        await Payment.find({
          user: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json({
        payments,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Unable to load payments.",
      });
    }
  }
);


/* =====================================
   SINGLE PAYMENT
===================================== */

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const payment =
        await Payment.findOne({
          _id: req.params.id,
          user: req.user.id,
        });

      if (!payment) {
        return res.status(404).json({
          message:
            "Payment not found.",
        });
      }

      res.json({
        payment,
      });

    } catch (error) {
      res.status(500).json({
        message:
          "Unable to load payment.",
      });
    }
  }
);


module.exports = router;