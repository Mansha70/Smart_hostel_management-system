const Announcement = require('../Models/Announcement');

const createAnnouncement = async (req, res) => {
  try {
    const { title, description, targetAudience } = req.body
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }
    const announcement = await Announcement.create({
      title,
      description,
      targetAudience,
      createdBy: req.user.id
    })
    res.status(201).json({
      success: true,
      message: "Announcement created successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id)
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      })
    }
    res.status(200).json({
      success: true,
      message: "Announcement deleted Successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { createAnnouncement, deleteAnnouncement }