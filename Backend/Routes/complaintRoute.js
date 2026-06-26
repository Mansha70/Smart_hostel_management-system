const express = require("express")
const compRouter = express.Router()
const upload=require("../Middleware/upload")

const  auth  = require('../Middleware/auth')
const {
  createComplaint,
  updateStatus,
  assignComplaint,
  getAllComplaints,
  getMyComplaints,
  getAssignedComplaints
} = require('../Controller/complaintController')
const adminOnly = require('../Middleware/adminOnly')
const staffOnly = require('../Middleware/staffOnly')

compRouter.get("/my", auth, getMyComplaints)
// Staff-only endpoint: list complaints assigned to the logged-in staff
compRouter.get("/assigned", auth, staffOnly, getAssignedComplaints)
compRouter.get("/getAll", auth, adminOnly, getAllComplaints)
compRouter.patch("/:id/assign", auth, adminOnly, assignComplaint)
compRouter.patch("/:id/status", auth, staffOnly, updateStatus)
compRouter.post("/createComplaint", auth,upload.single("media"),createComplaint)

module.exports = compRouter;

