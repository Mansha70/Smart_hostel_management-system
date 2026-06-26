const express = require('express');
const auth = require('../Middleware/auth');
const adminOnly = require('../Middleware/adminOnly');

const User = require('../Models/user');

const studentRouter = express.Router();

// Admin: list all student users
studentRouter.get('/getAll', auth, adminOnly, async (req, res) => {
  try {
    const students = await User.find(
      { role: 'student' },
      'name email role department created_at roomNumber phone_number hostel_block'
    );

    res.json({
      success: true,
      students: students.map((s) => ({
        _id: s._id,
        id: s._id,
        name: s.name,
        full_name: s.name,
        email: s.email,
        role: 'student',
        roomNumber: s.roomNumber,
        hostel_block: s.hostel_block,
        phone_number: s.phone_number,
        created_at: s.created_at,
      })),
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
});

module.exports = studentRouter;

