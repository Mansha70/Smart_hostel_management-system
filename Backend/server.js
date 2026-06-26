require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/* ---------------- DATABASE ---------------- */

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }
}

// Connect to DB before every request (works well for Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/* ---------------- ROUTES ---------------- */

const userRouter = require("./Routes/userRoute");
const compRouter = require("./Routes/complaintRoute");
const feedBackRouter = require("./Routes/feedBackRoute");
const AnnounceRouter = require("./Routes/AnnounceRoute");
const staffRouter = require("./Routes/staffRoute");
const studentRouter = require("./Routes/studentRoute");

app.use("/v1/api", userRouter);
app.use("/v1/api/complaints", compRouter);
app.use("/v1/api", feedBackRouter);
app.use("/v1/api", AnnounceRouter);
app.use("/v1/api/staff", staffRouter);
app.use("/v1/api/students", studentRouter);

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running Successfully 🚀",
  });
});

/* ---------------- 404 HANDLER ---------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ---------------- EXPORT ---------------- */

module.exports = app;