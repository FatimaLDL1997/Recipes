import e from "express";
import { StatusCodes } from "http-status-codes";

const errorHandleMiddleware = (err, req, res, next) => {
  console.log(err);
  const StatusCode = err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "something went wrong, try again later";
  res.status(StatusCode).json({ msg });
};

export default errorHandleMiddleware;
