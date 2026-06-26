const User = require("../Models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try{
      const {name,email,password,role,department,roomNumber}=req.body
  if(!name || !email ||!password){
    return res.json({
        success:false,
        message:"All required field are mandatory"
    })
  }
  //exisiting user
  const existingUser=await User.findOne({email})
  if(existingUser){
    return res.json({
        success:false,
        message:"User already Exist"
    })
  }
  const hashedPassword=await bcrypt.hash(password,10)
  const user=await User.create({
    name,
    email,
    password:hashedPassword,
    role:role||"student",
    department,
    roomNumber
  })
  return res.status(201).json({
    success:true,
    message:"User registered Successfully",
    user
  })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
 
}


const loginUser=async(req,res)=>{
  try{
    const {email,password}=req.body 
    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Email and Password are required"
      })
    }
   const user=await User.findOne({email})
  if(!user){
    return res.status(400).json({
      success:false,
      message:"User not found"
    })
  }
  const isMatch=await bcrypt.compare(password,user.password)
  if(!isMatch){
    return res.status(400).json({
      success:false,
      message:"Invalid Credential"
    })
  }
  //generate JWT
  const token=jwt.sign(
    {
      id:user._id,
      role:user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"7d"
    }
  )
 return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  }catch(error){
      return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}




module.exports = { registerUser,loginUser}