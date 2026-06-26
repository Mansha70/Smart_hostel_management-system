const express = require("express")
const auth  = require("../Middleware/auth")
const adminOnly = require("../Middleware/adminOnly")
const { createAnnouncement, deleteAnnouncement } = require('../Controller/AnnouceController')

const AnnounceRouter = express.Router()

AnnounceRouter.post("/create", auth, adminOnly, createAnnouncement)
AnnounceRouter.delete("/:id", auth, adminOnly, deleteAnnouncement)

module.exports = AnnounceRouter