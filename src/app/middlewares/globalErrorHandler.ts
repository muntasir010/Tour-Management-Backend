/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { enVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { validationError } from "../helpers/validationError";

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if(enVars.NODE_ENV ==="development"){
    console.log(err)
  }
  let statusCode = 500;
  let message = `Something Went Wrong ${err.message} !!.`;
  let errorSources: any = [];

  // Duplicate Error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // ObjectId Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  
  // Zod Error
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = validationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources;
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err:enVars.NODE_ENV=== "development"? err:null,
    stack: enVars.NODE_ENV === "development" ? err.stack : null,
  });
};
