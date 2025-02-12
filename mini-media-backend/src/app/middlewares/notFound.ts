/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from "express";
import httpStatus from "http-status";

const notFound: RequestHandler = (req, res, next): void => {
  res.status(httpStatus.NOT_FOUND).json({
    status: false,
    message: "APT not found!",
    error: {
      code: httpStatus.NOT_FOUND,
      message: httpStatus["404_MESSAGE"],
    },
  });
  return;
};

export default notFound;
