const Feedback = require('../Models/Feedback');
const Complaint = require('../Models/Complaint');

const createFeedBack = async (req, res) => {
  try {
    const { complaint, rating, review } = req.body
    if (!complaint || !rating) {
      return res.status(400).json({
        success: false,
        message: "Complaint and Rating are required"
      })
    }
    const complaintData = await Complaint.findById(complaint)
    if (!complaintData) {
      return res.status(404).json({
        success: false,
        message: "Complaint not Found"
      })
    }
    //Complaint resolved
    if (complaintData.status != "Resolved") {
      return res.status(404).json({
        success: false,
        message: "Feeback can be given after"
      })
    }
    //Already Submitted?
    const existingFeedback = await Feedback.findOne({
      complaint,
      student: req.user.id
    });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted"
      });
    }
    const feedback = await Feedback.create({
      complaint,
      student: req.user.id,
      rating,
      review
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

const getMyFeedbacks = async (req, res) => {
  const feedbacks = await Feedback.find({
    student: req.user.id
  })
    .populate("complaint");

  res.json({
    success: true,
    feedbacks
  });
}

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name email")
      .populate("complaint", "title category");

    res.status(200).json({
      success: true,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createFeedBack, getMyFeedbacks, getAllFeedbacks }