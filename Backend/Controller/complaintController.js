const Complaint = require('../Models/Complaint')
const Notification = require('../Models/Notification')
const User = require('../Models/user')

const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      roomNumber,
    } = req.body
    const mediaUrls=req.file?[req.file.path]:[]



    if (!title || !description || !category || !roomNumber) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      roomNumber,
      mediaUrls,
      student: req.user.id
    })

    // Notify admin/staff that a new complaint has been submitted
    // (TargetAudience not implemented in schema yet, so notify all admins)
    try {
      const admins = await User.find({ role: 'admin' }).select('_id');
      const notifications = admins.map((u) => ({
        user: u._id,
        title: 'New Complaint Submitted',
        message: `Complaint: ${title}`,
      }));

      if (notifications.length) await Notification.insertMany(notifications);
    } catch (e) {
      // Don't fail complaint creation if notification fails
      console.log('Notification error (admins):', e.message);
    }

    res.status(201).json({
      success: true,
      complaint
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

//see own complaints
const getMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({
    student: req.user.id
  })
  res.json({
    success: true,
    complaints
  })
}

//admin see all complaints
const getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find()
    .populate("student", "name email roomNumber")
    .populate("assignedStaff", "name department")
  res.json({
    success: true,
    complaints
  })
}

//assign complaint
const assignComplaint = async (req, res) => {
  const { staffId } = req.body

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      assignedStaff: staffId,
      status: "Assigned",
      $push: {
        timeline: {
          status: "Assigned",
          notes: "",
          createdBy: req.user.id,
        },
      },
    },
    {
      new: true,
    }
  )

  // Notify the student who submitted this complaint
  try {
    if (complaint?.student) {
      await Notification.create({
        user: complaint.student,
        title: 'Complaint Assigned',
        message: `Your complaint "${complaint.title}" has been assigned to staff.`,
      });
    }
  } catch (e) {
    console.log('Notification error (assign):', e.message);
  }

  res.json({
    success: true,
    complaint,
  })
}

//staff update status
const updateStatus = async (req, res) => {
  // Frontend sends lowercase statuses (assigned|in_progress|resolved|rejected)
  // Backend expects: "Assigned" | "In Progress" | "Resolved" | "Closed"
  const { status, notes } = req.body

  const normalizeBackendStatus = (raw) => {
    const s = String(raw ?? "").trim().toLowerCase()
    if (s === 'assigned') return 'Assigned'
    if (s === 'in_progress' || s === 'in progress') return 'In Progress'
    if (s === 'resolved') return 'Resolved'
    if (s === 'closed') return 'Closed'
    if (s === 'pending') return 'Pending'
    // treat rejected as closed for now
    if (s === 'rejected') return 'Closed'
    return 'Pending'
  }

  const backendStatus = normalizeBackendStatus(status)

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      status: backendStatus,
      resolutionNotes: typeof notes === 'string' ? notes : "",
      $push: {
        timeline: {
          status: backendStatus,
          notes: typeof notes === 'string' ? notes : "",
          createdBy: req.user.id,
        },
      },
    },
    { new: true }
  )

  // Notify student who submitted this complaint about staff status update
  try {
    if (complaint?.student) {
      await Notification.create({
        user: complaint.student,
        title: 'Complaint Updated',
        message: `Your complaint "${complaint.title}" status is now "${backendStatus}".`,
      });
    }
  } catch (e) {
    console.log('Notification error (status update):', e.message);
  }

  res.json({
    success: true,
    complaint,
  })
}


// staff see assigned complaints
const getAssignedComplaints = async (req, res) => {
  const complaints = await Complaint.find({
    assignedStaff: req.user.id,
  }).populate('student', 'name email roomNumber');

  res.json({
    success: true,
    complaints,
  });
};

module.exports = {
  createComplaint,
  updateStatus,
  assignComplaint,
  getAllComplaints,
  getMyComplaints,
  getAssignedComplaints,
}

