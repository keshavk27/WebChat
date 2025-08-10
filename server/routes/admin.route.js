import express from "express";
import { adminLogin, adminlogout, getadminprofile } from "../controllers/admin.controller.js";
import { isAdminAuthenticated } from "../middleware/adminauth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { deleteChatBetweenUsers,deleteUserByAdmin,deleteUserConversationsOnly,getAllUsers } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", isAdminAuthenticated, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard",
  });
});
adminRouter.get("/adminprofile",isAdminAuthenticated,getadminprofile);
adminRouter.post("/adminlogout",adminlogout);
adminRouter.post("/deleteUser",isAdminAuthenticated,isAdmin,deleteUserByAdmin);
adminRouter.post("/deleteUserconversation",isAdminAuthenticated,isAdmin,deleteUserConversationsOnly);
adminRouter.post("/deletechatbetweenUsers",isAdminAuthenticated,isAdmin,deleteChatBetweenUsers);
adminRouter.get("/getAllUsers",isAdminAuthenticated,isAdmin,getAllUsers);

export default adminRouter;
