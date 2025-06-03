import express from "express";
import MentorRequestController from "../controllers/mentorrequestcontroller.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = express.Router();

// Posts a mentor request with form data of user id and mentor Id
router.post("/", authenticateToken, MentorRequestController.postMentorRequest);

// Retrieves specific mentor request by Id
router.get(
  "/:id",
  authenticateToken,
  MentorRequestController.getMentorRequestById,
);

// Updates the mentor request details with id
router.put("/:id/:status", MentorRequestController.processRequestStatus);

export default router;
