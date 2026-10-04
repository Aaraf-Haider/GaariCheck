const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },

    inspectionNumber: {
      type: String,
      required: true,
      unique: true,
    },

    plan: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },
    },

    vehicle: {
      make: {
        type: String,
        required: true,
      },

      model: {
        type: String,
        required: true,
      },

      year: {
        type: Number,
        required: true,
      },

      registrationNumber: {
        type: String,
        default: "",
      },

      mileage: {
        type: Number,
        required: true,
      },

      color: {
        type: String,
        required: true,
      },

      transmission: {
        type: String,
        required: true,
      },

      fuelType: {
        type: String,
        required: true,
      },
    },

    purpose: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Inspection In Progress",
        "Report Ready",
        "Completed",
      ],
      default: "Submitted",
    },

    media: [
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    originalName: {
      type: String,
      default: "",
    },

    mimeType: {
      type: String,
      default: "",
        },
    captureType: {
        type: String,
        default: "Other",
        },
      },
    ],
    reportUrl: {
        type: String,
        default: "",
        },

        reportPublicId: {
        type: String,
        default: "",
        },

        reportOriginalName: {
        type: String,
        default: "",
        },

        reportUploadedAt: {
        type: Date,
        default: null,
        },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Inspection",
  inspectionSchema
);