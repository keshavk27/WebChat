import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new errorHandler("Admin access only", 403));
  }
  next();
});
