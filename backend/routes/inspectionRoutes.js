const express = require("express");

const Inspection =
  require("../models/Inspection");

const Payment =
  require("../models/Payment");

const protect =
  require("../middleware/authMiddleware");

const cloudinary =
  require("../config/cloudinary");

const upload =
  require("../middleware/uploadMiddleware");

const router = express.Router();


/* =====================================
   GUIDED CAPTURE TYPES
===================================== */

const REQUIRED_CAPTURE_TYPES = [
  "front",
  "rear",
  "left-side",
  "right-side",
  "front-left",
  "front-right",
  "rear-left",
  "rear-right",
  "dashboard",
  "odometer",
  "front-interior",
  "rear-interior",
  "engine-bay",
  "tyres-wheels",
];


/* =====================================
   CLOUDINARY UPLOAD
===================================== */

const uploadToCloudinary = (file) => {
  return new Promise(
    (resolve, reject) => {

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              "gaaricheck/inspections",

            resource_type:
              "auto",
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
        file.buffer
      );
    }
  );
};


/* =====================================
   CREATE INSPECTION
===================================== */

router.post(
  "/",
  protect,

  async (req, res) => {
    let claimedPayment = null;

    try {
      const {
        plan,
        paymentId,
        customer,
        vehicle,
        purpose,
        notes,
      } = req.body;


      if (
        !plan ||
        !paymentId ||
        !customer ||
        !vehicle
      ) {
        return res
          .status(400)
          .json({
            message:
              "Plan, payment and vehicle details are required.",
          });
      }


      /* --------------------------------
         CLAIM APPROVED PAYMENT
      -------------------------------- */

      claimedPayment =
        await Payment.findOneAndUpdate(
          {
            _id: paymentId,

            user:
              req.user.id,

            plan,

            status:
              "Approved",

            inspectionCreated:
              false,
          },

          {
            $set: {
              inspectionCreated:
                true,
            },
          },

          {
            new: true,
          }
        );


      if (!claimedPayment) {
        return res
          .status(403)
          .json({
            message:
              "A valid approved payment is required before starting this inspection.",
          });
      }


      /* --------------------------------
         CREATE INSPECTION
      -------------------------------- */

      const inspectionNumber =
        `GC-${Date.now()}`;


      const inspection =
        await Inspection.create({
          user:
            req.user.id,

          payment:
            claimedPayment._id,

          inspectionNumber,

          plan,

          customer,

          vehicle,

          purpose,

          notes,

          status:
            "Submitted",
        });


      return res
        .status(201)
        .json({
          message:
            "Inspection created successfully.",

          inspection,
        });

    } catch (error) {

      console.error(
        "Create inspection error:",
        error
      );


      /* --------------------------------
         RETURN PAYMENT IF CREATION FAILS
      -------------------------------- */

      if (claimedPayment) {

        try {
          await Payment.findByIdAndUpdate(
            claimedPayment._id,
            {
              inspectionCreated:
                false,
            }
          );

        } catch (rollbackError) {

          console.error(
            "Payment rollback error:",
            rollbackError
          );
        }
      }


      return res
        .status(500)
        .json({
          message:
            "Unable to create inspection.",
        });
    }
  }
);


/* =====================================
   GET CUSTOMER INSPECTIONS
===================================== */

router.get(
  "/",
  protect,

  async (req, res) => {
    try {

      const inspections =
        await Inspection.find({
          user:
            req.user.id,
        }).sort({
          createdAt: -1,
        });


      return res
        .status(200)
        .json({
          inspections,
        });

    } catch (error) {

      console.error(
        "Get inspections error:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "Server error",
        });
    }
  }
);


/* =====================================
   UPLOAD GUIDED VEHICLE MEDIA
===================================== */

router.post(
  "/:id/upload",
  protect,
  upload.array(
    "media",
    15
  ),

  async (req, res) => {
    try {

      /* --------------------------------
         FIND CUSTOMER INSPECTION
      -------------------------------- */

      const inspection =
        await Inspection.findOne({
          _id:
            req.params.id,

          user:
            req.user.id,
        });


      if (!inspection) {
        return res
          .status(404)
          .json({
            message:
              "Inspection not found.",
          });
      }


      /* --------------------------------
         CHECK FILES
      -------------------------------- */

      if (
        !req.files ||
        req.files.length === 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please upload the required vehicle photos/videos.",
          });
      }


      /* --------------------------------
         READ CAPTURE TYPES
      -------------------------------- */

      let captureTypes = [];

      try {

        captureTypes =
          JSON.parse(
            req.body
              .captureTypes ||
              "[]"
          );

      } catch (parseError) {

        return res
          .status(400)
          .json({
            message:
              "Invalid guided capture information.",
          });
      }


      /* --------------------------------
         VALIDATE ARRAY
      -------------------------------- */

      if (
        !Array.isArray(
          captureTypes
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Capture types must be provided correctly.",
          });
      }


      /* --------------------------------
         FILE COUNT MUST MATCH TYPES
      -------------------------------- */

      if (
        captureTypes.length !==
        req.files.length
      ) {
        return res
          .status(400)
          .json({
            message:
              "Each uploaded file must have a matching vehicle capture type.",
          });
      }


      /* --------------------------------
         CHECK INVALID TYPES
      -------------------------------- */

      const invalidTypes =
        captureTypes.filter(
          (type) =>
            !REQUIRED_CAPTURE_TYPES.includes(
              type
            )
        );


      if (
        invalidTypes.length > 0
      ) {
        return res
          .status(400)
          .json({
            message:
              `Invalid capture type: ${invalidTypes[0]}`,
          });
      }


      /* --------------------------------
         CHECK DUPLICATES
      -------------------------------- */

      const uniqueTypes =
        new Set(
          captureTypes
        );


      if (
        uniqueTypes.size !==
        captureTypes.length
      ) {
        return res
          .status(400)
          .json({
            message:
              "Each guided vehicle view can only be uploaded once.",
          });
      }


      /* --------------------------------
         CHECK ALL REQUIRED VIEWS
      -------------------------------- */

      const missingTypes =
        REQUIRED_CAPTURE_TYPES.filter(
          (requiredType) =>
            !uniqueTypes.has(
              requiredType
            )
        );


      if (
        missingTypes.length > 0
      ) {
        return res
          .status(400)
          .json({
            message:
              `${missingTypes.length} required vehicle view(s) are still missing.`,

            missingCaptures:
              missingTypes,
          });
      }


      /* --------------------------------
         EXACT REQUIRED COUNT
      -------------------------------- */

      if (
        req.files.length !==
        REQUIRED_CAPTURE_TYPES.length
      ) {
        return res
          .status(400)
          .json({
            message:
              `Please upload all ${REQUIRED_CAPTURE_TYPES.length} required guided vehicle views.`,
          });
      }


      /* --------------------------------
         UPLOAD TO CLOUDINARY
      -------------------------------- */

      const uploadedMedia = [];


      for (
        let index = 0;
        index <
        req.files.length;
        index++
      ) {

        const file =
          req.files[index];

        const captureType =
          captureTypes[index];


        const result =
          await uploadToCloudinary(
            file
          );


        uploadedMedia.push({
          url:
            result.secure_url,

          publicId:
            result.public_id,

          resourceType:
            file.mimetype.startsWith(
              "video/"
            )
              ? "video"
              : "image",

          originalName:
            file.originalname,

          mimeType:
            file.mimetype,

          captureType,
        });
      }


      /* --------------------------------
         SAVE MEDIA
      -------------------------------- */

      inspection.media.push(
        ...uploadedMedia
      );


      await inspection.save();


      return res
        .status(200)
        .json({
          message:
            "Guided vehicle media uploaded successfully.",

          completedCaptures:
            uploadedMedia.length,

          media:
            uploadedMedia,
        });

    } catch (error) {

      console.error(
        "Media upload error:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            error.message ||
            "Media upload failed.",
        });
    }
  }
);


/* =====================================
   VIEW REPORT
===================================== */

router.get(
  "/:id/report",
  protect,

  async (req, res) => {
    try {

      const inspection =
        await Inspection.findOne({
          _id:
            req.params.id,

          user:
            req.user.id,
        });


      if (!inspection) {
        return res
          .status(404)
          .json({
            message:
              "Inspection not found",
          });
      }


      if (
        !inspection.reportUrl
      ) {
        return res
          .status(404)
          .json({
            message:
              "Report is not ready yet",
          });
      }


      const reportResponse =
        await fetch(
          inspection.reportUrl
        );


      if (
        !reportResponse.ok
      ) {
        return res
          .status(500)
          .json({
            message:
              "Unable to load report",
          });
      }


      const reportBuffer =
        Buffer.from(
          await reportResponse.arrayBuffer()
        );


      res.setHeader(
        "Content-Type",
        "application/pdf"
      );


      const fileName =
        inspection
          .reportOriginalName ||
        "GaariCheck-Report.pdf";


      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileName}"`
      );


      return res.send(
        reportBuffer
      );

    } catch (error) {

      console.error(
        "View report error:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "Unable to view report",
        });
    }
  }
);


/* =====================================
   DOWNLOAD REPORT
===================================== */

router.get(
  "/:id/report/download",
  protect,

  async (req, res) => {
    try {

      const inspection =
        await Inspection.findOne({
          _id:
            req.params.id,

          user:
            req.user.id,
        });


      if (!inspection) {
        return res
          .status(404)
          .json({
            message:
              "Inspection not found",
          });
      }


      if (
        !inspection.reportUrl
      ) {
        return res
          .status(404)
          .json({
            message:
              "Report is not ready yet",
          });
      }


      const reportResponse =
        await fetch(
          inspection.reportUrl
        );


      if (
        !reportResponse.ok
      ) {
        return res
          .status(500)
          .json({
            message:
              "Unable to load report",
          });
      }


      const reportBuffer =
        Buffer.from(
          await reportResponse.arrayBuffer()
        );


      const fileName =
        inspection
          .reportOriginalName ||
        `${inspection.inspectionNumber}-Report.pdf`;


      res.setHeader(
        "Content-Type",
        "application/pdf"
      );


      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );


      return res.send(
        reportBuffer
      );

    } catch (error) {

      console.error(
        "Download report error:",
        error
      );


      return res
        .status(500)
        .json({
          message:
            "Unable to download report",
        });
    }
  }
);


module.exports = router;