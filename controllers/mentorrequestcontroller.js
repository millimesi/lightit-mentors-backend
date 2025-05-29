// Manage and controlles mentor Request
import MentorRequest from "../models/mentorRequest.js";
import Mentor from "../models/mentor.js";
import User from "../models/user.js";
// import sendEmail from "../utils/emailsender.js";
// import { addEmailJob, addDeclineRequestJob } from "../utils/bullJobs.js";

export default class MentorRequestController {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async postMentorRequest(req, res) {
    console.log("Post /mentor_request is Accessed");

    // get the request data
    const mentorId = req.body.mentorId || null;
    const userId = req.body.userId || null;
    const numberOfMentees = parseInt(req.body.numberOfMentees) || null;
    const residentialArea = req.body.residentialArea || null;
    const message = req.body.message || null;

    // check if all required request data exists
    if (!(mentorId && userId && numberOfMentees && residentialArea)) {
      // return incomplete data
      return res.status(400).json({ error: "Incomplete request data" });
    }

    // check the existence of the user and mentor
    try {
      // check if the mentor exists by the id
      const mentorRequested = await Mentor.findOne({ _id: mentorId }); // returns true if it exists

      // respond mentor id doesnt exist
      if (!mentorRequested) {
        return res.status(400).json({ error: "Mentor doesn't exist" });
      }

      // chek if the user exists by the id
      const userExists = await User.exists({ _id: userId });

      if (!userExists) {
        return res.status(400).json({ error: "User doesn't exist" });
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

      // send an email for the requested mentor
      // 💥This Job is not working needs fix
      // const mentorEmail = mentorRequested.email;
      // const emailSubject = "Your have new mentor request!";
      // const emailhtmlBody = `
      //           <html>
      //           <body>
      //               <p><b>You have a new mentor request for ${numberOfMentees} mentees.</b></h3>
      //               <p><strong>Location:</strong> ${residentialArea}</p>
      //               <p><strong>Message:</strong> ${message}</p>
      //               <p>
      //                   <a href="http://localhost:5000/mentor_request/${insertInfo._id}/accepted" style="padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px;">Accept Request</a>
      //                   <a href="http://localhost:5000/mentor_request/${insertInfo._id}/rejected" style="padding: 10px 20px; background-color: #dc3545; color: #fff; text-decoration: none; border-radius: 5px;">Reject Request</a>
      //               </p>
      //           </body>
      //           </html>
      //       `;
      // 💥This Job is not working needs fix
      // await addEmailJob(mentorEmail, emailSubject, emailhtmlBody);

      // if the request is not proccessed with the given time it will be declined by light it
      console.log(insertInfo._id);

      // 💥This is not working Please Check it
      // await addDeclineRequestJob(insertInfo._id);

      // respond with request id and request status
      return res.status(200).json({
        requestId: insertInfo._id,
        status: insertInfo.status,
      });
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }

  static async getMentorRequestById(req, res) {
    console.log("Get /mentor_request/:id is Accessed");

    // get the id
    const requestId = req.params.id;

    // query the database by id
    try {
      const mentorRequest = await MentorRequest.findById(requestId);
      // if the response is null respond not found
      if (!mentorRequest) {
        return res.status(400).json({ error: "Mentor_request not found" });
      }

      // if it exists respond the data
      res.status(200).json(mentorRequest);
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }

  static async processRequestStatus(req, res) {
    console.log("PUT /mentor_request/:id/:status is Accessed");

    // get the parmateres from the request
    const { id, status } = req.params; // the status can only be accepted or rejected

    // Validate status value
    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({ error: "Invalid status" });
    }

    try {
      // check if the requeste is proccessed before to be rejected, accepted and declined
      // get the mentor request by Id
      const getMentorRequest = await MentorRequest.findById(id);
      const requestStatus = getMentorRequest.status;

      // if the status is not  one of them respond the request is processed
      if (requestStatus !== "pending") {
        return res.status(409).json({ message: `request is ${requestStatus}` });
      }

      // update the status of the mentor request
      const updatedRequest = await MentorRequest.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      );

      // if the status of the updated is rejected send request rejected
      if (updatedRequest.status === "rejected") {
        // send email to the user to notify is requset is rejected by the mentor
        // get the requesting user
        const requestingUser = await User.findOne({
          _id: updatedRequest.userId,
        });

        // get the requested mentor
        const mentorId = updatedRequest.mentorId;
        const mentorRequested = await Mentor.findOne({ _id: mentorId });

        // const userEmail = requestingUser.email;
        // const emailSubject = "Your request for mentor is rejected!";
        // const emailhtmlBody = `
        //             <html>
        //             <body>
        //                 <p> Dear ${requestingUser.name} your request to Mentor ${mentorRequested.name} is <b>rejected</b>.</p>
        //                 <p><strong>For furthe assistance contact light it Mentors!</strong></p>
        //             </body>
        //             </html>
        //         `;
        // 💥This Job is not working needs fix
        // await addEmailJob(userEmail, emailSubject, emailhtmlBody);

        return res.status(200).json({ messege: "request rejected" });
      }

      // update numberOfMentee of the mentor
      const mentorId = updatedRequest.mentorId;

      // find the mentor and upadte it by incrementing its numberOfMentee by one
      await Mentor.findByIdAndUpdate(
        mentorId,
        { $inc: { numberOfMentee: 1 } }, // Increment numberOfMentee by 1
        { new: true } // Return the updated document
      );

      /**  for accepted request send contact info for the mentor */
      // get the user info by id and get the phoneNumber and email
      // of the user and menteeFull name
      const requestingUser = await User.findOne({ _id: updatedRequest.userId });

      res.status(200).json({
        messege: "request Accepted",
        UserInfo: {
          menteeFullName: updatedRequest.menteeFullName,
          phoneNumber: requestingUser.phoneNumber,
          email: requestingUser.email,
        },
      });

      // get the mentor email and send him email giving detail for the contact of user
      // const mentorRequested = await Mentor.findOne({ _id: mentorId });

      // send an email for the requested mentor
      // const mentorEmail = mentorRequested.email;
      // const emailSubject = "You can find details of the request here!";
      // const emailhtmlBody = `
      //           <html>
      //           <body>
      //               <p> Dear Mentor contact the user and start mentoring ${updatedRequest.menteeFullName}.</h3>
      //               <p><strong>Phone Number:</strong> ${requestingUser.phoneNumber}</p>
      //               <p><strong>Email:</strong> ${requestingUser.email}</p>
      //               <p><strong>Location:</strong> ${updatedRequest.location}</p>
      //               <p><strong>Message:</strong> ${updatedRequest.message}</p>
      //               <p style="padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 20px; display: inline-block;">
      //                   You are Trusted for Brightening the Future!
      //               </p>

      //           </body>
      //           </html>
      //       `;

      // 💥This Job is not working needs fix
      // await addEmailJob(mentorEmail, emailSubject, emailhtmlBody);

      // 💥This Job is not working needs fix
      // send email for the user to notify the request is accepted!
      // const userEmail = requestingUser.email;
      // const userEmailSubject = "Your request for mentor is Accepted!";
      // const userEmailhtmlBody = `
      //               <html>
      //               <body>
      //                   <p> Dear ${requestingUser.name} your request to Mentor ${mentorRequested.name} is <b>accepted</b>.</p>
      //                   <p>contact the mentor:</p>
      //                   <p><strong>Phone Number:</strong> ${mentorRequested.phoneNumber}</p>
      //                   <p><strong>Email:</strong> ${mentorRequested.email}</p>
      //                   <p><strong>Reach us for further assistance!</strong></p>
      //               </body>
      //               </html>
      //           `;

      // await addEmailJob(userEmail, userEmailSubject, userEmailhtmlBody);
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }
}
