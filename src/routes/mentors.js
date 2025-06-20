import express from "express";
import MentorController from "../controllers/mentorcontroller.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Retrieves list of paginated mentors
// router.get("/", authenticateToken, MentorController.getMentors);
router.get("/", MentorController.getMentors);

//
// Retrieves mentor of the specified Id
router.get("/:id", authenticateToken, MentorController.getMentorByID);

export default router;
