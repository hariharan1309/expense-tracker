import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../utils/models/User.js";

export interface CustomReq extends Request {
  user?: any;
}
const authHandler = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // getting the bearer JWT token if it was there
    }
    if (!token) {
      // because its a middleware we are returning the response instead of throwing Error
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this route",
      });
    }
    const userId: any = jwt.verify(token, process.env.JWT_SECRET_KEY!); // encoded token with our token secret key
    const user = await User.findById(userId?.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this route",
      });
    }
    req.user = user; // getting the user data in the req object for further operations
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "You are not authorized to access this route",
    });
  }
};

export default authHandler;
