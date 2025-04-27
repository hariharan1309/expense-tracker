import type { Request, Response, NextFunction } from "express";

interface ErrorExtended extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}
export const errorHandler = (
  err: ErrorExtended,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let error = { ...err };

    error.message = err.message;
    // Bad ObjectId
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }
    if (err.code === 11000) {
      const message = " Duplicate Value Entered";
      error = new Error(message);
      error.statusCode = 400;
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map(
        (val: any) => val?.message || "Error "
      ); // as we might get lot of validation errors
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }
    //  now send the error to the client in res
    res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorHandler;
