import { param } from "express-validator";

const idValidatorAndSanitizer = [
  param("id").trim().isMongoId().withMessage("Invalid ID format"),
];

export default idValidatorAndSanitizer;
