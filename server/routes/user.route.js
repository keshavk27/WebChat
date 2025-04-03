import express from 'express'
import { getprofile, login, logout, register,getotheruser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const userRouter=express.Router();

userRouter.post('/register',register)
userRouter.post('/login',login);
userRouter.get('/getprofile',isAuthenticated,getprofile);
userRouter.post('/logout',isAuthenticated,logout);
userRouter.get('/getotheruser',isAuthenticated,getotheruser);

export default userRouter;