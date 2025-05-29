import User from "./models/user.js";
import Mentor from "./models/mentor.js";
import MentorRequest from "./models/mentorRequest.js";
import mongoose from "mongoose";
import mentorList from "./Mentorsdata.js";
import fs from "fs";
import crypto from "crypto";
import { log } from "console";
import mentors from "./mentor.json" assert { type: "json" };

// Get inforamtion about the database connection paramater
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 27017;
const dbName = process.env.MENTORS_DB || "light_it_Mentors";
const dbUrl = `mongodb://${host}:${port}/${dbName}`;

// Connect to database
async function connnectToDb() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database is connected!");
  } catch (err) {
    console.log(`Error: Database error- ${err}`);
  }
}

async function populateMentors() {
  for (const mentor of mentorList) {
    // find user with email
    const newMentor = new Mentor(mentor);
    // try {
    //     const existingUser = await Mentor.findOne({ email: newMentor.email})
    //     if (existingUser) {
    //         console.log('User exists', existingUser);
    //         return;
    //     }
    // } catch (err) {
    //     console.log(`Finding Error: ${err}`);
    // }
    // Save user
    try {
      const insertInfo = await newMentor.save();
      console.log(insertInfo._id.toString());
    } catch (err) {
      console.log(`Error: Database Insertion Erorr: ${err}`);
    }
  }
}

function writeToFile(fileName, data) {
  const jsonFormatted = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(fileName, jsonFormatted);
    console.log("File written successfully");
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}

// Create JWT_SECRET key
// const secret = crypto.randomBytes(32).toString("hex");
// console.log(secret);

(async () => {
  mentors.forEach((mentor, idx) => {
    // Use id if available, otherwise use idx+1 for uniqueness
    const id = mentor.id || idx + 1;
    // Normalize name and fatherName for email
    const namePart = (mentor.name || "mentor")
      .toLowerCase()
      .replace(/\s+/g, "");
    const fatherPart = (mentor.fatherName || "mentor")
      .toLowerCase()
      .replace(/\s+/g, "");
    mentor.email = `${namePart}.${fatherPart}${id}@example.com`;
    mentor.password = "1234";
    mentor.phoneNumber = `+251911${String(id).padStart(6, "0")}`;
  });
  // await connnectToDb();
  // console.log(await User.find());
  // await User.collection.drop();
  // await populateMentors();
  // const data = await User.find();
  // const data = await Mentor.find();
  // const data = await MentorRequest.find();
  // console.log(await MentorRequest.find())
  writeToFile("mentors.json", mentors);
  // mongoose.connection.close();
})();
