import logger from "../config/logger.js";

export default function errorHandler(err, req, res, _next) {
  if (err.isOperational) {
    // Known error: send the error message and the status code
    const response = {
      status: err.status,
      message: err.message,
    };
    if (err.errors) {
      response.errors = err.errors;
    }
    return res.status(err.statusCode).json(response);
  } else {
    // Unknown or program error: don't like details
    logger.error("💥CRITICAL ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
}
