// Mentor endpoints controller
import DbClient from "../utils/db.js";
import getPrice from "../utils/mentorPrice.js";

// Initialize the database client
const db = new DbClient();

/**
 * @description Controller class for mentor-related endpoints.
 * Provides methods to fetch mentor lists and individual mentor details.
 */
export default class MentorController {
  /**
   * GET /mentors
   * Fetch a paginated list of mentors with relevant public information.
   * Query params: page (number), limit (number)
   */
  static async getMentors(req, res) {
    console.log("GET /mentors is accessed");

    try {
      // Parse pagination parameters with defaults
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;

      // Get total number of mentors for pagination info
      const totalNumOfMentors = await db.nbMentors();

      // Fetch paginated and sorted list of mentors from the database
      const listOfMentors = await db.getListOfMentors(page, limit);

      // Prepare mentor list with only non-sensitive, relevant fields
      let mentorList = [];

      for (const mentor of listOfMentors) {
        const mentorInfo = {
          id: mentor._id,
          sex: mentor.sex,
          name: mentor.name,
          fatherName: mentor.fatherName,
          profileImage: mentor.profileImage
            ? `http://localhost:5000/profileImage/${mentor.profileImage}`
            : null,
          gradeBand: mentor.gradeBand,
          mentoringMode: mentor.mentoringMode,
          city: mentor.city,
          about: mentor.about,
          education: mentor.education,
          WorkExperience: mentor.WorkExperience,
          LifePhilosophy: mentor.LifePhilosophy,
          rating: mentor.rating,
          review: mentor.review,
          trainingAndCertification: mentor.trainingAndCertification,
          BackgroundCheck: mentor.BackgroundCheck,
          isVisible: mentor.isVisible,
          skillAndTalent: mentor.skillAndTalent,
          category: mentor.category,
          price: mentor.price,
          // Sensitive fields (email, password, phoneNumber) are intentionally omitted
        };

        mentorList.push(mentorInfo);
      }

      // Respond with total count and filtered mentor list
      res.status(200).json({ totalNumOfMentors, mentorList });
    } catch (err) {
      console.log(`Error in getMentors: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }

  /**
   * GET /mentors/:id
   * Fetch detailed information for a single mentor by ID.
   * Path param: id (mentor's MongoDB _id)
   */
  static async getMentorByID(req, res) {
    console.log("GET /mentors/:id is accessed");

    const mentorId = req.params.id;

    try {
      // Fetch mentor by ID from the database
      const mentor = await db.getMentor(mentorId);

      // Prepare mentor info with only non-sensitive, relevant fields
      const mentorInfo = {
        id: mentor._id,
        sex: mentor.sex,
        name: mentor.name,
        fatherName: mentor.fatherName,
        profileImage: mentor.profileImage
          ? `http://localhost:5000/profileImage/${mentor.profileImage}`
          : null,
        gradeBand: mentor.gradeBand,
        mentoringMode: mentor.mentoringMode,
        city: mentor.city,
        about: mentor.about,
        education: mentor.education,
        WorkExperience: mentor.WorkExperience,
        LifePhilosophy: mentor.LifePhilosophy,
        rating: mentor.rating,
        review: mentor.review,
        trainingAndCertification: mentor.trainingAndCertification,
        BackgroundCheck: mentor.BackgroundCheck,
        isVisible: mentor.isVisible,
        skillAndTalent: mentor.skillAndTalent,
        category: mentor.category,
        price: mentor.price,
        // Sensitive fields (email, password, phoneNumber) are intentionally omitted
      };

      // Respond with the mentor's public information
      res.status(200).json({ mentorInfo });
    } catch (err) {
      console.log(`Error in getMentorByID: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }
}
