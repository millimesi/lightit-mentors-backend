// Mentor endpoints controller
import DbClient from "../utils/db.js";
import Mentor from "../models/mentor.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";

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
  static async getMentors(req, res, next) {
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
      next(new AppError("Server error occurred", 500));
    }
  }

  /**
   * GET /mentors/:id
   * Fetch detailed information for a single mentor by ID.
   * Path param: id (mentor's MongoDB _id)
   */
  static async getMentorByID(req, res, next) {
    console.log("GET /mentors/:id is accessed");

    const mentorId = req.params.id;

    // Validate the objectId before querying
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return next(new AppError("Invalid mentor ID format", 400));
    }

    try {
      // Fetch mentor by ID from the database
      const mentor = await Mentor.findById(mentorId);

      // If the mentor doesn't exist return not find
      if (!mentor) {
        return next(
          new AppError(`Mentor doesn't exist with Id: ${mentorId}`, 400),
        );
      }

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
      next(new AppError("Server error occurred", 500));
    }
  }
}
