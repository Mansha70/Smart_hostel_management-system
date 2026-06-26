const multer=require("multer")
const {storage}=require("../config/cloudConfig.js")
const upload = multer({storage})

module.exports=upload