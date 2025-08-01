import express from 'express'
import { changePassword,getprofile, login, logout, register,getotheruser, updateFullname } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import {upload} from "../middleware/multer.middlewate.js"
// import {uploadfile} from '../utilities/cloudinary.utils.js'
import { uploadFile } from '../controllers/uploadFile.controller.js';
import { updateAvatar } from '../controllers/user.controller.js';
import { uploadAvatar } from '../middleware/multerforProfilepic.middleware.js';
import { isAlreadyLoggedIn } from '../middleware/isAlreadyLoggedIn.middleware.js';

const userRouter=express.Router();

userRouter.post('/register',register)
userRouter.post('/login',isAlreadyLoggedIn,login);
userRouter.get('/getprofile',isAuthenticated,getprofile);
userRouter.post('/logout',isAuthenticated,logout);
userRouter.get('/getotheruser',isAuthenticated,getotheruser);

userRouter.route('/uploadfile').post(
    upload.fields([
        {
            name:"docs",
            maxcount:1
        },

    ]),
    uploadFile
);

//CRUD 
userRouter.post('/changepassword', isAuthenticated, changePassword);
userRouter.post('/changefullname',isAuthenticated,updateFullname);
userRouter.post(
  "/updateavatar",
  isAuthenticated,
  uploadAvatar.single("avatar"),  
  updateAvatar           
);

export default userRouter;