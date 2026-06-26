require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

// Models
const User = require("./Models/user.js");
const Feedback = require("./Models/Feedback.js");
const Complaint = require("./Models/Complaint.js");

// Routes
const userRouter = require("./Routes/userRoute.js");
const compRouter = require("./Routes/complaintRoute.js");
const feedBackRouter = require("./Routes/feedBackRoute.js");
const AnnounceRouter = require("./Routes/AnnounceRoute.js");
const staffRouter = require("./Routes/staffRoute.js");
const studentRouter = require("./Routes/studentRoute.js");


const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- MIDDLEWARE ---------------- */
// Allow frontend (Vite) to call the API during development.
const cors = require("cors");
const corsOptions = {
  origin: true, // allow requests from any origin
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

/* ---------------- ROUTES ---------------- */
app.use("/v1/api", userRouter);
app.use("/v1/api/complaints", compRouter);
app.use("/v1/api", feedBackRouter);
app.use("/v1/api", AnnounceRouter);
app.use("/v1/api/staff", staffRouter);
app.use("/v1/api/students", studentRouter);

/* ---------------- DB CONNECTION ---------------- */

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.log("❌ DB connection error:", err);
  }
}

connectDB();

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

