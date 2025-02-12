import httpStatus from "http-status";
import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../types/types";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Invalid ID",
    errorSources,
  };
};
