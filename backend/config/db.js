const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const username = encodeURIComponent(
      process.env.MONGODB_USER.trim()
    );

    const password = encodeURIComponent(
      process.env.MONGODB_PASSWORD.trim()
    );

    const host = process.env.MONGODB_HOST.trim();

    const uri =
      `mongodb+srv://${username}:${password}@${host}/gaaricheck?retryWrites=true&w=majority&appName=gaaricheckadmin`;

    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;