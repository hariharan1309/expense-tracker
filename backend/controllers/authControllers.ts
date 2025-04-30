import { NextFunction } from "express";
import User from "../utils/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export interface ErrorExtended extends Error {
  statusCode?: number;
}
export interface ExtendedResponse extends Response {
  status: any;
}
export const regHandler = async (
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    //@ts-ignore
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      let error: ErrorExtended = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    const newUser = await User.create(
      { name, email, password: hash },
      {
        session,
      }
    );
    let token = jwt.sign({ id: newUser[0]._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    }); // signing token with user id and secret key with expiration
    session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const loginHandler = async (
  req: Request,
  res: ExtendedResponse,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      let error: ErrorExtended = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    // checking pasword
    let isMatch = await bcrypt.compare(password, user?.password!);
    if (!isMatch) {
      let error: ErrorExtended = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      success: true,
      token,
      message: "Logged In Successfully",
    });
  } catch (error) {
    next(error);
  }
};
