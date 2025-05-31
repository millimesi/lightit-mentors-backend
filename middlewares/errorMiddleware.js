export default function errorHandler(err, req, res, _next) {
  if (err.isOperational) {
    // Known error: send the error message and the status code
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown or program error: don't like details
    console.error("💥CRITICAL ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
}
