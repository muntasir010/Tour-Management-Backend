/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { TGenericErrorResponse } from "../interfaces/error.type";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid Mongodb ObjectId. Please Provide a valid id.",
  };
};
