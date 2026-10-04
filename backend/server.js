const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");
const express = require("express");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


connectDB();


const app = express();


app.use(cors());

app.use(express.json());


app.get("/", (req, res) => {
  res.send("GaariCheck API is working!");
});


app.use("/api/auth", authRoutes);

app.use(
  "/api/inspections",
  inspectionRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);


const PORT =
  process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(
    `GaariCheck server running on port ${PORT}`
  );
});