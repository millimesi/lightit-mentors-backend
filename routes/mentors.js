import express from "express";
import MentorController from "../controllers/mentorcontroller.js";
import authenticateToken from "../utils/midlewares.js";

const router = express.Router();

// Retrieves list of paginated mentors
router.get("/", authenticateToken, MentorController.getMentors);

//
// Retrieves mentor of the specified Id
router.get("/:id", authenticateToken, MentorController.getMentorByID);

export default router;
