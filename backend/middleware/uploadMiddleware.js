const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, MP4 and MOV files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,

  limits: {
    fileSize: 30 * 1024 * 1024,
  },

  fileFilter,
});

module.exports = upload;