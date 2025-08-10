import Message from  '../models/message.model.js'
import Conversation from '../models/conversation.model.js'
import {asyncHandler} from '../utilities/asyncHandler.utility.js'
import {errorHandler} from '../utilities/errorHandler.utility.js'
import {getSocketId, ioServer} from '../socket/socket.js'

export const sendMessage=asyncHandler(async(req,res,next)=>{
    const { message, messageType, fileName} =req.body;
    const senderId=req.user._id;
    const receiverId=req.params.receiverId;
     

    if(!senderId || !receiverId||(!message&&messageType!=='file'))
    {
        return next(new errorHandler("All fields are required",400));
    }

    let conversation=await Conversation.findOne({
        participants:{$all:[senderId,receiverId]},
    })

    if(!conversation)
    {
        conversation=await Conversation.create({
            participants:[senderId,receiverId]
        });
    }

    const newMessage=await Message.create({
        senderId,
        receiverId,
        message,
        messageType: messageType||'text',
        fileName
    });

    if(newMessage)
    {
        conversation.messages.push(newMessage._id);
        await conversation.save();

    }

    //socket.io implementation
    const socketId=getSocketId(receiverId);
    ioServer.to(socketId).emit("newMessage",newMessage)


    res.status(200)
    .json({
        success:true,
        message:"Message sent successfully",
        responseData:{
            newMessage
        }
    })
})

export const getmessage=asyncHandler(async(req,res,next)=>{
    const myId=req.user._id;
    const otherpartyId=req.params.otherpartyId;

    if(!myId || !otherpartyId)
    {
        return next(new errorHandler("All fields are required",400));
    }

    let conversation=await Conversation.findOne({
        participants:{$all:[myId,otherpartyId]},
    }).populate("messages");

    res.status(200)
    .json({
        success:true,
        responseData:{
            conversation
        }
    })
})

export const clearConversation = asyncHandler(async (req, res, next) => {

  const senderId = req.user._id;  
  const receiverId = req.params.otherpartyId;

  
  if (!senderId || !receiverId) {
    return next(new errorHandler("One or both users not found", 404));
  }

    let conversation=await Conversation.findOne({
        participants:{$all:[senderId,receiverId]},
    })

  if (!conversation) {
    return res.status(200).json({
      success: true,
      message: "No conversation found between the users",
    });
  }

  if (conversation.messages.length > 0) {
    await Message.deleteMany({ _id: { $in: conversation.messages } });
    conversation.messages = [];
    await conversation.save();
  }
  

  const senderSocketId = getSocketId(senderId);
  const receiverSocketId = getSocketId(receiverId);

  if (senderSocketId) {
    ioServer.to(senderSocketId).emit("chatCleared");
  }
  if (receiverSocketId) {
    ioServer.to(receiverSocketId).emit("chatCleared");
  }

  res.status(200).json({
    success: true,
    message: `Chat between ${senderId} and ${receiverId} has been cleared for both users`,
  });
});