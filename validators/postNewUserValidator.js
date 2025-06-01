import { body } from "express-validator";

const postNewUserValidators = [
  body("name")
    .notEmpty()
    .withMessage("Name is Required")
    .isAlpha()
    .withMessage("Name can not have numbers"),
  body("fatherName")
    .notEmpty()
    .withMessage("Father Name is Required")
    .isAlpha()
    .withMessage("Father Name can not have numbers"),
  body("email").isEmail().withMessage("Must be valid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must at least have 6 characters"),
];

export default postNewUserValidators;
