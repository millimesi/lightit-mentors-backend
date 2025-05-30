import MentorController from "../controllers/mentorcontroller.js";
import MentorRequestController from "../controllers/mentorrequestcontroller.js";
import authenticateToken from "../utils/midlewares.js";

const insertRoutes = (api) => {
  // Posts a mentor request with form data of user id and mentor Id
  api.post(
    "/mentor_request",
    authenticateToken,
    MentorRequestController.postMentorRequest
  );
  // retrives specific mentor request by Id
  api.get(
    "/mentor_request/:id",
    authenticateToken,
    MentorRequestController.getMentorRequestById
  );
  // updates the mentor request details with id
  api.put(
    "/mentor_request/:id/:status",
    MentorRequestController.processRequestStatus
  );
};

export default insertRoutes;
