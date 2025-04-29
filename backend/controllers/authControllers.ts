import { NextFunction } from "express";
import User from "../utils/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface ErrorExtended extends Error {
  statusCode?: number;
}
interface ExtendedResponse extends Response {
  status: any;
}
export const regHandler = async (
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    console.log(req);
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      let error: ErrorExtended = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email, password: hash });
    let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    }); // signing token with user id and secret key with expiration
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};
