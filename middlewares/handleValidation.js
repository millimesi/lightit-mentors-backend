import { validationResult, matchedData } from "express-validator";
import AppError from "../utils/appError.js";

export default function validationHandler(req, res, next) {
  const errors = validationResult(req); // Get Validation Result
  if (!errors.isEmpty()) {
    // Extract error message and format it in to list
    const extractedErrors = errors
      .array()
      .map((err) => ({ [err.path]: `[${err.value}] is Invalid, ${err.msg}` }));

    const error = new AppError("Validation failed", 422);
    error.errors = extractedErrors; // Attach array of errors
    return next(error);
  }
  req.cleanData = matchedData(req); // Get validated and sanitized data only
  next();
}
