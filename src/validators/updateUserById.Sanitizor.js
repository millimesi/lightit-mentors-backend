import { body } from "express-validator";

// The may not contain every all user model field
// The user my update one of name and fatherName but Not password and Email Yet
// Sanitize the name and father name field and use matched data is bettor

const updateUserByIdSanitizer = [
  body("name").optional({ checkFalsy: true }).trim().escape(),
  body("fatherName").optional({ checkFalsy: true }).trim().escape(),
];

export default updateUserByIdSanitizer;
