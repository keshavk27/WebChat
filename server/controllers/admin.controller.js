import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import User from "../models/user.model.js";
import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const adminLogin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new errorHandler("Username and password required", 400));
  }

  const adminUser = await User.findOne({ username });

  if (!adminUser || !adminUser.isAdmin) {
    return next(new errorHandler("Unauthorized: Admin access only", 401));
  }

  const isPasswordValid = await bcrypt.compare(password, adminUser.password);
  if (!isPasswordValid) {
    return next(new errorHandler("Invalid credentials", 401));
  }
  const tokendata={
    _id:adminUser._id,
    isAdmin:true
  }

  const token = jwt.sign(tokendata,process.env.JWT_SECRET_KEY,{ expiresIn: process.env.JWT_EXPIRE });
  const loggedinAdmin=await User.findById(adminUser._id).select("-password")

  res.cookie("admin_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24*60*60*1000),
    })
    .status(200)
    .json({
      success: true,
      message: "Admin logged in successfully",
      responseData: {
        loggedinAdmin
      },
    });
});

export const adminlogout = asyncHandler(async(req, res, next) => {

    res.status(200)
    .cookie("admin_token","",{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    .json({
        success:true,
        message: "Admin logout successfull"
        
    })

    
})


export const deleteUserByAdmin = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next(new errorHandler("Username is required", 400));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const userId = user._id;

  const conversations = await Conversation.find({
    participants: userId,
  });

  const messageIds = conversations.flatMap((conv) => conv.messages);

  await Message.deleteMany({ _id: { $in: messageIds } });
  await Conversation.deleteMany({ participants: userId });
  await User.deleteOne({ _id: userId });

  res.status(200).json({
    success: true,
    message: `User '${username}' and all related data deleted.`,
  });
});


export const deleteUserConversationsOnly = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next(new errorHandler("Username is required", 400));
  }

  const user = await User.findOne({ username });

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const userId = user._id;

  const conversations = await Conversation.find({
    participants: userId,
  });

  if (conversations.length === 0) {
    return res.status(200).json({
      success: true,
      message: `No conversations found for user '${username}'.`,
    });
  }

  const messageIds = conversations.flatMap(conv => conv.messages);


  if(messageIds.length>0)
  {
    await Message.deleteMany({ _id: { $in: messageIds } });
  }

  await Conversation.deleteMany({ participants: userId });

  res.status(200).json({
    success: true,
    message: `All conversations and messages for user '${username}' have been deleted.`,
  });
});

export const deleteChatBetweenUsers = asyncHandler(async (req, res, next) => {
  const { username1, username2 } = req.body;

  if (!username1 || !username2) {
    return next(new errorHandler("Both usernames are required", 400));
  }

  const user1 = await User.findOne({ username: username1 });
  const user2 = await User.findOne({ username: username2 });

  if (!user1 || !user2) {
    return next(new errorHandler("One or both users not found", 404));
  }

  const conversation = await Conversation.findOne({
    participants: { $all: [user1._id, user2._id] },
  });

  if (!conversation) {
    return res.status(200).json({
      success: true,
      message: "No conversation found between the users",
    });
  }

  if (conversation.messages.length > 0) {
    await Message.deleteMany({ _id: { $in: conversation.messages } });
  }

  await Conversation.deleteOne({ _id: conversation._id });

  res.status(200).json({ 
    success: true,
    message: `Chat between ${username1} and ${username2} has been deleted`,
  });
});
export const getadminprofile = asyncHandler(async(req, res, next) => {

    const userId= req.user._id;
    // console.log(userId);

    const adminprofile =await User.findById(userId)

    res.status(200)
    .json({
        success:true,
        message: "admin profile fetched successfully",
        responseData:{
            adminprofile
        }
    })
})
