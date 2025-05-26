import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * @description Defines the schema for mentors in the app
 * @property {String} name - name of the mentor
 * @property {String} fatherName - father name of the mentor
 * @property {String} email - email of the mentor
 * @property {String} password - hashed password of the user
 * @property {String} phoneNumber - phone number of the 
 * @property {String} profileImage -profile image of the mentor
 * @property {String[]} mentorType - type of the mentorship
 * for e.g ["Academic Tutor", "Life Skill Coach"]
 * @property {String} city - Working city of the mentor
 * @property {String[]} location - Working location of the mentor in the city
 * @property {Number} rating - rating of the mentor out of ten
 * @property {Object[]} reviews - reviews given to the mentor
 * @property {String} reviews.userId - the reviewer user Id
 * @property {String} reviews.comment - the comment of the user
 * @property {Number} reviews.rating - rating for the mentor by user
 */

const mentorSchema = new Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: ''},
    phoneNumber: { type: String, required: true },
    mentorType: { type: [String], default: ['Academic Tutor'] },
    city: { type: String, default: 'Jimma' },
    location: { type: [String], default: [] },
    rating: { type: Number, default: 1 },
    numberOfMentee: { type: Number, default: 0 },
    reviews: [{
      userId: { type: String, default: '' },
      comment: { type: String, defalt: '' },
      rating: { type: Number, default: 0 },
    }],
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt time stamp
  { versionKey: '__v' }, // Automatical creates and update version of the schema
);

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;
