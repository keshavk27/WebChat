import Message from  '../models/message.model.js'
import Conversation from '../models/conversation.model.js'
import {asyncHandler} from '../utilities/asyncHandler.utility.js'
import {errorHandler} from '../utilities/errorHandler.utility.js'
import {getSocketId, ioServer} from '../socket/socket.js'

export const sendMessage=asyncHandler(async(req,res,next)=>{
    const message =req.body.message;
    const senderId=req.user._id;
    const receiverId=req.params.receiverId;
    

    if(!senderId || !receiverId||!message)
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
        message
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