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

/* ---------------- DATABASE ---------------- */

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected");

    isConnected = true;
  } catch (err) {
    console.error(err);
  }
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

/* ---------------- TEST ROUTE ---------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend Running Successfully 🚀",
  });
});

/* ---------------- EXPORT ---------------- */

module.exports = app;