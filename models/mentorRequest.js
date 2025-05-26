import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * @description mentorRequest schema for mentor to list or requess
 * @property {String} userId - id of the requesting user
 * @property {String} mentorId - id of the requested mentor
 * @property {String} menteeFullName - information of the mentee
 * @property {String} location - location of the mentorship or online
 * @property {String} Status - status of the reques enum of
 * 'pending', 'Accepted', 'Regjected'
 * @property {String} message - message for the mentor
 */
const mentorRequestSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
    menteeFullName: { type: String, required: true },
    message: { type: String },
    location: { type: String },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'Declined'],
        message: '{VALUE} is not supported',
      },
      default: 'pending'
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt time stamp
  { versionKey: '__v' }, // Automatical creates and update version of the schema
);

const MentorRequest = mongoose.model('MentorRequest', mentorRequestSchema);
export default MentorRequest;
