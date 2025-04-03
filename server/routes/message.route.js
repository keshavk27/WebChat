import express from 'express'
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { getmessage, sendMessage } from '../controllers/message.controller.js';

const messageRouter=express.Router();

messageRouter.post('/send/:receiverId',isAuthenticated,sendMessage);
messageRouter.get('/getmessage/:otherpartyId',isAuthenticated,getmessage);


export default messageRouter;