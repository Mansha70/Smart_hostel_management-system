const express = require("express")
const auth = require("../Middleware/auth")
const adminOnly = require("../Middleware/adminOnly")
const { createFeedBack, getMyFeedbacks, getAllFeedbacks } = require('../Controller/feedBackController')

const feedBackRouter = express.Router()

feedBackRouter.post("/", auth, createFeedBack)
feedBackRouter.get("/my", auth, getMyFeedbacks)
feedBackRouter.get("/", auth, adminOnly, getAllFeedbacks)

module.exports = feedBackRouter