const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "JazzCash",
        "Easypaisa",
        "Bank Transfer",
      ],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
      trim: true,
    },

    receiptUrl: {
      type: String,
      required: true,
    },

    receiptPublicId: {
      type: String,
      required: true,
    },

    receiptOriginalName: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    inspectionCreated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);