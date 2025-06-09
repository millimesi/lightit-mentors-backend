// Mentor endpoints controller
import Mentor from "../models/mentor.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";

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
    try {
      // Parse pagination parameters with defaults
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      // Get user role
      const isAdmin = false; // Admin features are not yet applied

      // Prepare database filter object
      const filter = {};

      // Currently the logic is if the user is admin get every list
      // But is the user is  not admin just get only isVisible=true mentors
      if (!isAdmin) {
        filter.isVisible = true;
      }

      // Fetch paginated and sorted list of mentors from the database
      const skip = (page - 1) * limit;
      const listOfMentors = await Mentor.find(filter)
        .sort({ numberOfMentee: 1 })
        .skip(skip)
        .limit(limit);

      // Get total number of mentors for pagination info
      const totalNumOfMentors = await Mentor.countDocuments(filter);

      // Prepare mentor list with only non-sensitive, relevant fields
      let mentorList = [];

      for (const mentor of listOfMentors) {
        const mentorInfo = {
          id: mentor._id,
          sex: mentor.sex,
          name: mentor.name,
          fatherName: mentor.fatherName,
          profileImage: mentor.profileImage ? `?${mentor.profileImage}` : null,
          gradeBand: mentor.gradeBand,
          mentoringMode: mentor.mentoringMode,
          city: mentor.city,
          about: mentor.about,
          education: mentor.education,
          WorkExperience: mentor.WorkExperience,
          lifePhilosophy: mentor.lifePhilosophy,
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
      const response = {
        page,
        totalPage: Math.ceil(totalNumOfMentors / limit),
        mentorList,
      };

      res.status(200).json(response);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /mentors/:id
   * Fetch detailed information for a single mentor by ID.
   * Path param: id (mentor's MongoDB _id)
   */
  static async getMentorByID(req, res, next) {
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
      return next(err); // Safest and most common pattern
    }
  }
}
