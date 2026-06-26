const express = require('express');
const auth = require('../Middleware/auth');
const adminOnly = require('../Middleware/adminOnly');

const { getAllStaff } = require('../Controller/staffController');

const staffRouter = express.Router();

// Admin: list all staff users
staffRouter.get('/getAll', auth, adminOnly, getAllStaff);

module.exports = staffRouter;

