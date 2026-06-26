const mongoose = require("mongoose")

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "staff", "admin"],
    required: true
  },
  department: {
    type: String,
    enum: [
      "Electricity",
      "water",
      "WiFi",
      "Mess",
      "Cleaning",
      "Furniture"
    ]
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  roomNumber: {
    type: String,
    required: function () { return this.role === "student"; }
  }
})

const User = mongoose.model("User", userSchema)

module.exports = User