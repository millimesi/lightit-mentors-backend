import { body } from "express-validator";

const postNewUserValidators = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .bail()
    .isAlpha()
    .withMessage("Name can not have numbers"),
  body("fatherName")
    .exists({ checkFalsy: true })
    .withMessage("Father Name is required")
    .bail()
    .isAlpha()
    .withMessage("Father Name can not have numbers"),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Must be valid email format"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must at least have 6 characters"),
];

export default postNewUserValidators;
