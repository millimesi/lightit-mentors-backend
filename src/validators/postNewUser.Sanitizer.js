import { body } from "express-validator";

const postNewUserSanitizer = [
  body("name").trim().escape(),
  body("fatherName").trim().escape(),
  body("email").normalizeEmail(),
  body("password").trim(),
];

export default postNewUserSanitizer;
