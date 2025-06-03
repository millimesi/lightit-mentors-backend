import { validationResult, matchedData } from "express-validator";
import AppError from "../utils/appError.js";

export default function validationHandler(req, res, next) {
  const errors = validationResult(req); // Get Validation Result
  if (!errors.isEmpty()) {
    // Extract error message and format it in to list
    const extractedErrors = errors
      .array()
      .map((err) => ({ field: err.path, message: err.msg }));

    const error = new AppError("Validation failed", 422);
    error.errors = extractedErrors; // Attach array of errors
    return next(error);
  }

  const cleanData = matchedData(req); // Get validated and sanitized data only

  // Remove Id from CleanData
  if (cleanData.id) delete cleanData.id;

  req.cleanData = cleanData;
  next();
}
