import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * @description mentorRequest schema for mentor to list or request
 * @property {String} userId - id of the requesting user
 * @property {String} mentorId - id of the requested mentor
 * @property {String} menteeFullName - information of the mentee
 * @property {String} residentialArea - Residential area/neighborhood of the mentee
 * @property {String} Status - status of the request enum of
 * 'pending', 'Accepted', 'Rejected'
 * @property {String} message - message for the mentor
 */
const mentorRequestSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    numberOfMentees: { type: Number, required: true, default: 1 },
    message: { type: String },
    residentialArea: { type: String },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected", "Declined"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt time stamp
  { versionKey: "__v" }, // Automatically creates and update version of the schema
);

const MentorRequest = mongoose.model("MentorRequest", mentorRequestSchema);
export default MentorRequest;
