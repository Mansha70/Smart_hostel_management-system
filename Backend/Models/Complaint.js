const mongoose = require("mongoose")

const Schema = mongoose.Schema

const complaintSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      // Must match frontend values (see CreateComplaintPage + COMPLAINT_CATEGORIES)
      "electrical",
      "plumbing",
      "internet",
      "furniture",
      "cleanliness",
      "mess_food",
      "security",
      "other",
    ],
    required: true
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Assigned",
      "In Progress",
      "Resolved",
      "Closed",
    ],
    default: "Pending"
  },
  roomNumber: {
    type: String,
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  mediaUrls: [String],

  // Stores the latest resolution/notes from staff.
  resolutionNotes: {
    type: String,
    default: ""
  },

  // Timeline of status changes to display to the student.
  // Example: [{ status: 'Assigned', notes: 'Assigned to ...', createdAt: ... }, ...]
  timeline: [
    {
      status: {
        type: String,
        enum: [
          "Pending",
          "Assigned",
          "In Progress",
          "Resolved",
          "Closed",
        ],
        required: true,
      },
      notes: {
        type: String,
        default: "",
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
})

const complaintModel = mongoose.model("complaintModel", complaintSchema)

module.exports = complaintModel