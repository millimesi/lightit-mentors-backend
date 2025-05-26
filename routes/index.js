import MentorController from "../controllers/mentorcontroller.js";
import UserController from "../controllers/usercontroller.js";
import MentorRequestController from "../controllers/mentorrequestcontroller.js";
import authenticateToken from '../utils/midlewares.js';

const insertRoutes = (api) => {
    // retrives list of paginated mentors
    api.get('/mentors', authenticateToken, MentorController.getMentors);

    // retrives mentor of the specified Id
    api.get('/mentors/:id', authenticateToken, MentorController.getMentorByID);

    // Posts a mentor request with form data of user id and mentor Id
    api.post('/mentor_request', authenticateToken, MentorRequestController.postMentorRequest);

    // retrives specific mentor request by Id
    api.get('/mentor_request/:id', authenticateToken, MentorRequestController.getMentorRequestById);

    // updates the mentor request details with id
    api.get('/mentor_request/:id/:status', MentorRequestController.processRequestStatus)

    // create new user account with form data
    api.post('/users', UserController.postNewUser);

    // login by authenticating the password
    api.post('/users/login', UserController.userLogin)

    // retrives user account with specific id
    api.get('/users/:id', authenticateToken, UserController.getUserById)

    // updates the user account with specific id
    api.put('/users/:id', authenticateToken, UserController.updateUserById)
    
    // deletes the user account
    api.delete('/users/:id', authenticateToken, UserController.deleteById)
}

export default insertRoutes;
