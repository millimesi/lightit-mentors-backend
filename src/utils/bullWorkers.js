import { Worker } from "bullmq";
import sendEmail from "./emailsender.js";
import MentorRequest from "../models/mentorRequest.js";
import mongoose from "mongoose";
// import { addEmailJob } from "./bullJobs.js";

// connect to the database
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 27017;
const dbName = process.env.MENTORS_DB || "light_it_Mentors";
const dbUrl = `mongodb://${host}:${port}/${dbName}`;
// Establish a new connection for the worker
async function connectToDatabase() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected in worker");
  } catch (err) {
    console.error("MongoDB connection error in worker:", err);
  }
}

// connect to the database
connectToDatabase();

const emailWorker = new Worker(
  "send-Email",
  async (job) => {
    await sendEmail(job.data.sendToEMail, job.data.subject, job.data.htmlBody);
  }, // send email
  {
    connection: { host: "localhost", port: 6379 },
    concurrency: 5,
  },
);

emailWorker.on("active", (job) => {
  console.log(`${job.name} job: ${job.id} is now active; processing...`);
});

emailWorker.on("completed", (job) => {
  console.log(`${job.name} job: ${job.id} has been completed successfully.`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`${job.name}job: ${job.id} failed with error: ${err.message}`);
});

// decline request worker
const declineRequestWorker = new Worker(
  "decline-Request",
  async (job) => {
    // Process the decline request job
    try {
      // check if the request is proceesed or not

      const requestData = await MentorRequest.findById(job.data.id);
      // if request is pending
      if (requestData.status === "pending") {
        const declineRequest = await MentorRequest.findByIdAndUpdate(
          job.data.id,
          { status: "Declined" },
          { new: true, runValidators: true },
        );
        console.log(`request is ${declineRequest.status}`);

        // const requestingUser = await User.findOne({ _id: updatedRequest.userId });

        // // get the requested mentor
        // const mentorId = updatedRequest.mentorId;
        // const mentorRequested = await Mentor.findOne({ _id: mentorId });

        // const userEmail = requestingUser.email;
        // const emailSubject = "Your request for mentor is rejected!"
        // const emailhtmlBody = `
        //     <html>
        //     <body>
        //         <p> Dear ${requestingUser.name} your request to Mentor ${mentorRequested.name} is <b>rejected</b>.</p>
        //         <p><strong>For furthe assistance contact light it Mentors!</strong></p>
        //     </body>
        //     </html>
        // `;

        // await addEmailJob(userEmail, emailSubject, emailhtmlBody);
      }
      console.log(`request is ${requestData.status} before it declined!`);
    } catch (error) {
      console.error("Error declining mentor request:", error);
    }
  },
  {
    connection: { host: "localhost", port: 6379 },
    concurrency: 2,
  },
);

// event listners of declineRequest jon
declineRequestWorker.on("active", (job) => {
  console.log(`${job.name} job: ${job.id} is now active; processing...`);
});

declineRequestWorker.on("completed", (job) => {
  console.log(`${job.name} job: ${job.id} has been completed successfully.`);
});

declineRequestWorker.on("failed", (job, err) => {
  console.error(`${job.name} job: ${job.id} failed with error: ${err.message}`);
});
