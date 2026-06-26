const { default: mongoose } = require("mongoose")

const Schema=mongoose.Schema

const feedbackSchema=new mongoose.Schema({
    complaint:{  // to know feedback is given for which complaint
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complaint",
        required:true
    },
    student:{ // to know which student has submitted the feedback form
          type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    review:{
        type:String
    }
})

module.exports=mongoose.model("Feedback",feedbackSchema)
