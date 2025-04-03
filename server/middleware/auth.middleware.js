import { asyncHandler } from "../utilities/asyncHandler.utility.js"
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from 'jsonwebtoken'


export const isAuthenticated=asyncHandler(async(req, res, next)=>{
    const token = req.cookies.token;

    if(!token)
    {
        return next(new errorHandler("Invalid User",400))
    }

    const tokenData=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=tokenData;
    next();
})