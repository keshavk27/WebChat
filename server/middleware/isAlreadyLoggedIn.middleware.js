import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { apiResponse } from "../utilities/apiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";

export const isAlreadyLoggedIn = asyncHandler(async (req, res, next) => {
  try { 
    const token =req.cookies?.token 

    if (!token) return next(); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded?._id);
    console.log(user)

    if (user) 
    {
      return res.status(403)
      .json(
        new apiResponse(
            403,
            {},
            "You are already logged In"
        )
      );
    }

    return next();            
  } catch (error) {
    return next();
  }
}
)