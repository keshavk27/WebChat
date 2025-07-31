import User from "../models/user.model.js"
import { asyncHandler } from "../utilities/asyncHandler.utility.js"
import { errorHandler } from "../utilities/errorHandler.utility.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import path from 'path';
import { uploadfile } from "../utilities/cloudinary.utils.js";
import fs from 'fs'
export const register = asyncHandler(async(req, res, next) => {

    const { fullname, username, password, gender } = req.body;
    if (!fullname || !username || !password || !gender) {
        return next(new errorHandler("All fields are required",400))

    }
    const user=await User.findOne({username});
    if(user)
    {
        return next(new errorHandler("User is already registered",400))
    }
    
    const hashedpassword=await bcrypt.hash(password,10)
    const avatartype=gender==="male" ? "boy" : "girl"
    const avatar = `https://avatar.iran.liara.run/public/${avatartype}?username=${username}`;

    const newUser = await User.create({
        fullname,
        username,
        password:hashedpassword,
        gender,
        avatar
    });


    const tokenData = {
        _id: newUser?._id
    }

    const token=jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE} )



    res
    .status(200)
    .cookie("token",token,{
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
        secure: true,
        sameSite:"None"
    })
    .json({
        success:true,
        message: "User registered successfully",
        responseData:{
            newUser,
            token
        }
    });
    console.log("usercreated:", fullname);

    
})


export const login = asyncHandler(async(req, res, next) => {

    const { username, password } = req.body;
    if ( !username || !password ) {
        return next(new errorHandler("Enter a valid username or password",400))

    }

    const user=await User.findOne({username});
    if(!user)
    {
        return next(new errorHandler("Enter a valid username or password",400))
    }
    
    const isValidPassword=await bcrypt.compare(password,user.password)
    if(!isValidPassword)
    {
        return next(new errorHandler("Enter a valid username or password",400))
    }

    const tokenData = {
        _id: user?._id
    }


    const token=jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRE} )
    const loggedinuser=await User.findById(user._id).select("-password ")

    res.status(200)
    .cookie("token",token,{
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
        secure: true,
        sameSite:"None"
    })
    .json({
        success:true,
        message: "User logged in successfully",
        responseData:{
            loggedinuser,
            token
        }
    })
    console.log("userloggedin:", username);

    
})

export const getprofile = asyncHandler(async(req, res, next) => {

    const userId= req.user._id;
    // console.log(userId);

    const profile =await User.findById(userId)

    res.status(200)
    .json({
        success:true,
        message: "User profile fetched successfully",
        responseData:{
            profile
        }
    })
})


export const logout = asyncHandler(async(req, res, next) => {

    res.status(200)
    .cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    .json({
        success:true,
        message: "logout successfull"
        
    })
    console.log("user logged out");

    
})

export const getotheruser = asyncHandler(async(req, res, next) => {


    const otheruser =await User.find({_id:{$ne:req.user._id}})

    res.status(200)
    .json({
        success:true,
        responseData:{
            otheruser
        }
    })
})


export const changePassword = asyncHandler(async (req, res, next) => {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(new errorHandler("Both current and new passwords are required", 400));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        return next(new errorHandler("User not found", 404));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        return next(new errorHandler("Current password is incorrect", 401));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });

    console.log("Password changed for:", user.username);
});

export const updateFullname = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const { fullname } = req.body;

  if (!fullname || fullname.trim().length === 0) {
    return next(new errorHandler("Full name is required", 400));
  }


  user.fullname = fullname.trim();
  await user.save();

  res.status(200).json({
    success: true,
    message: "Full name updated successfully",
    responseData: {
      fullname: user.fullname,
    },
  });
});

export const updateAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  if (!req.file) {
    return next(new errorHandler("No image file provided", 400));
  }

  const localFilePath = path.resolve(req.file.path);

  // Upload to Cloudinary
  const cloudinaryResponse = await uploadfile(localFilePath);

  if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
    return next(new errorHandler("Failed to upload avatar", 500));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: cloudinaryResponse.secure_url },
    { new: true }
  );

  // Clean up temp file
//   fs.unlinkSync(localFilePath);

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    responseData: {
      avatarUrl: updatedUser.avatar
    }
  });
});