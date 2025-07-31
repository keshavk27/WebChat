import express from 'express'
import { isAuthenticated } from '../middleware/auth.middleware.js';
import { clearConversation, getmessage, sendMessage } from '../controllers/message.controller.js';

const messageRouter=express.Router();

messageRouter.post('/send/:receiverId',isAuthenticated,sendMessage);
messageRouter.get('/getmessage/:otherpartyId',isAuthenticated,getmessage);

//CRUD
messageRouter.delete('/clearchat/:otherpartyId', isAuthenticated, clearConversation);


export default messageRouter;