// middleware/isAuthenticated.middleware.js
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";

export const isAdminAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) {
    return next(new errorHandler("Not authenticated", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = decoded;
  next();
});
