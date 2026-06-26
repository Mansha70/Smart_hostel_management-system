const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    targetAudience:{
        type:String,
        enum:[
            "All",
            "Students",
            "Staff"
        ],
        default:"All"
    }
},
{
    timestamps:true
}
);

module.exports = mongoose.model(
    "Announcement",
    announcementSchema
);