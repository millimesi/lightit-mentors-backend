import express from "express";
import UserController from "../controllers/usercontroller.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import postNewUserValidators from "../validators/postNewUser.Validator.js";
import postNewUserSanitizer from "../validators/postNewUser.Sanitizer.js";
import validationHandler from "../middlewares/handleValidation.js";
import idValidatorAndSanitizer from "../validators/id.ValidatorAndSanitizer.js";
import updateUserByIdSanitizer from "../validators/updateUserById.Sanitizor.js";

const router = express.Router();

router.post(
  "/",
  [...postNewUserValidators, ...postNewUserSanitizer],
  validationHandler,
  UserController.postNewUser,
);

// login by authenticating the password
router.post("/login", UserController.userLogin);

// retrieves user account with specific id
router.get("/:id", authenticateToken, UserController.getUserById);

// updates the user account with specific id
router.put(
  "/:id",
  [...idValidatorAndSanitizer, ...updateUserByIdSanitizer],
  validationHandler,
  authenticateToken,
  UserController.updateUserById,
);

// deletes the user account
router.delete("/:id", authenticateToken, UserController.deleteById);

export default router;
