import express from "express";
import UserController from "../controllers/usercontroller.js";
import authenticateToken from "../utils/midlewares.js";
import postNewUserValidators from "../validators/postNewUser.Validator.js";
import validationHandler from "../middlewares/handleValidation.js";

const router = express.Router();

router.post(
  "/",
  postNewUserValidators,
  validationHandler,
  UserController.postNewUser,
);

// login by authenticating the password
router.post("/login", UserController.userLogin);

// retrieves user account with specific id
router.get("/:id", authenticateToken, UserController.getUserById);

// updates the user account with specific id
router.put("/:id", authenticateToken, UserController.updateUserById);

// deletes the user account
router.delete("/:id", authenticateToken, UserController.deleteById);

export default router;
