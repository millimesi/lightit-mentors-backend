// Manage and controlles mentor Request
import MentorRequest from "../models/mentorRequest.js";
import Mentor from "../models/mentor.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import AppError from "../utils/appError.js";

export default class MentorRequestController {
  static async postMentorRequest(req, res, next) {
    // Get the request data
    const mentorId = req.body.mentorId || null;
    const userId = req.body.userId || null;
    const numberOfMentees = parseInt(req.body.numberOfMentees) || null;
    const residentialArea = req.body.residentialArea || null;
    const message = req.body.message || null;

    // Check if all required request data exists
    if (!(mentorId && userId && numberOfMentees && residentialArea)) {
      return next(new AppError("Incomplete request data", 400));
    }

    try {
      // Check if the mentor exists by the id
      const mentorRequested = await Mentor.findOne({ _id: mentorId }); // returns true if it exists

      // Respond mentor id doesnt exist
      if (!mentorRequested) {
        return next(
          new AppError(`Mentor doesn't exist with Id: ${mentorId}`, 400),
        );
      }

      // Check if the user exists by the id
      const userExists = await User.exists({ _id: userId });

      if (!userExists) {
        return next(new AppError(`User doesn't exist with Id: ${userId}`, 400));
      }

      // create mentor request object
      const mentorRequestObj = {
        mentorId,
        userId,
        numberOfMentees,
        residentialArea,
        message,
      };

      // create the mentor request and save it to the database
      const mentorRequest = new MentorRequest(mentorRequestObj);
      const insertInfo = await mentorRequest.save();

      // 💥This Job is not working needs fix
      // Instead of Email send phone text for ethiopian Application with bull job
      // await addEmailJob(mentorEmail, emailSubject, emailhtmlBody);

      // If the request is not processed with the given time it will be declined by light it
      // 💥This is not working Please Check it
      // await addDeclineRequestJob(insertInfo._id);

      // respond with request id and request status
      return res.status(200).json({
        requestId: insertInfo._id,
        status: insertInfo.status,
      });
    } catch (err) {
      return next();
    }
  }

  static async getMentorRequestById(req, res, next) {
    // Get the id
    const requestId = req.params.id;
    // Validate the objectId before querying
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return next(new AppError("Invalid mentor ID format", 400));
    }

    // Query the database by id
    try {
      const mentorRequest = await MentorRequest.findById(requestId);
      // If the response is null respond not found
      if (!mentorRequest) {
        return next(
          new AppError(
            `Mentor request data doesn't exist with Id: ${requestId}`,
            400,
          ),
        );
      }

      // If it exists respond the data
      res.status(200).json(mentorRequest);
    } catch (err) {
      return next(new AppError("Server error occurred", 500));
    }
  }

  static async processRequestStatus(req, res, next) {
    const { id, status } = req.params;
    // Validate status value
    if (status !== "accepted" && status !== "rejected") {
      return next(new AppError("Invalid status", 400));
    }

    try {
      // Get the mentor request by Id
      const getMentorRequest = await MentorRequest.findById(id);

      if (!getMentorRequest) {
        return next(
          new AppError(`Mentor request data is not found with Id: ${id}`, 400),
        );
      }
      const requestStatus = getMentorRequest.status;

      if (requestStatus !== "pending") {
        return next(new AppError(`Request is already ${requestStatus}`, 409));
      }

      // Update the status of the mentor request
      const updatedRequest = await MentorRequest.findByIdAndUpdate(
        id,
        { status: status },
        { new: true },
      );

      if (updatedRequest.status === "rejected") {
        // Get the requesting user
        // Get the requested mentor and
        // Send rejection text
        // 💥This Job is not working needs fix
        // await addEmailJob(userEmail, emailSubject, emailhtmlBody);

        return res.status(200).json({ messege: "request rejected" });
      }

      // Update numberOfMentee of the mentor
      const mentorId = updatedRequest.mentorId;

      await Mentor.findByIdAndUpdate(
        mentorId,
        { $inc: { numberOfMentee: 1 } },
        { new: true },
      );

      /**  for accepted request send contact info for the mentor */
      // get the user info by id and get the phoneNumber and email
      // of the user and menteeFull name
      const requestingUser = await User.findOne({ _id: updatedRequest.userId });

      res.status(200).json({
        message: "request Accepted",
        UserInfo: {
          menteeFullName: updatedRequest.menteeFullName,
          phoneNumber: requestingUser.phoneNumber,
          email: requestingUser.email,
        },
      });

      // get the mentor email and send him email giving detail for the contact of user

      // 💥This Job is not working needs fix
      // await addEmailJob(mentorEmail, emailSubject, emailhtmlBody);

      // 💥This Job is not working needs fix
      // send email for the user to notify the request is accepted
      // await addEmailJob(userEmail, userEmailSubject, userEmailhtmlBody);
    } catch (err) {
      return next(new AppError("Server error occurred", 500));
    }
  }
}
