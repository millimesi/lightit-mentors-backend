import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Sub-schema for detailed rating breakdown.
 */
const ratingDetailSchema = new Schema(
  {
    oneStar: { type: Number, default: 0 },
    twoStar: { type: Number, default: 0 },
    threeStar: { type: Number, default: 0 },
    fourStar: { type: Number, default: 0 },
    fiveStar: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * Sub-schema for overall rating.
 */
const ratingSchema = new Schema(
  {
    roundedAverage: { type: Number, default: 0 },
    ratingDetail: { type: ratingDetailSchema, default: () => ({}) },
  },
  { _id: false }
);

/**
 * Sub-schema for mentor reviews.
 */
const reviewSchema = new Schema(
  {
    userName: { type: String, default: "" },
    comment: { type: String, default: "" },
    rating: { type: Number, default: 0 },
  },
  { _id: false }
);

/**
 * Sub-schema for training and certification details.
 */
const trainingAndCertificationSchema = new Schema(
  {
    status: { type: Boolean, default: false },
    trainer: { type: String, default: null },
  },
  { _id: false }
);

/**
 * @description Defines the schema for mentors in the app.
 * This schema is designed to closely match the mentor data structure
 * as seen in mentor.json, supporting all relevant fields for the application.
 */
const mentorSchema = new Schema(
  {
    sex: { type: String, enum: ["Male", "Female"], required: true }, // Gender of the mentor
    name: { type: String, required: true }, // Mentor's name
    fatherName: { type: String, required: true }, // Father's name
    profileImage: { type: String, default: "" }, // Path or URL to profile image
    gradeBand: { type: [String], default: [] }, // Grade bands the mentor covers
    mentoringMode: { type: [String], default: [] }, // Modes of mentoring (e.g., In-Person, online)
    city: { type: String, default: "Jimma" }, // City of operation
    about: { type: String, default: "" }, // Mentor's bio/description
    education: { type: [String], default: [] }, // Educational background
    WorkExperience: { type: [String], default: [] }, // Work experience entries
    LifePhilosophy: { type: String, default: "" }, // Mentor's life philosophy
    rating: { type: ratingSchema, default: () => ({}) }, // Rating details
    review: { type: [reviewSchema], default: [] }, // Array of reviews
    trainingAndCertification: {
      type: trainingAndCertificationSchema,
      default: () => ({}),
    }, // Training and certification info
    BackgroundCheck: { type: Boolean, default: false }, // Background check status
    isVisible: { type: Boolean, default: true }, // Visibility status
    skillAndTalent: { type: [String], default: [] }, // Skills and talents
    category: { type: [String], default: [] }, // Mentor categories
    price: { type: Number, default: 0 }, // Price per session or service
    email: { type: String, unique: true }, // Mentor's email (should be unique)
    password: { type: String, required: true }, // Hashed password
    phoneNumber: { type: String, required: true }, // Contact phone number
  },
  { timestamps: true, versionKey: "__v" }
);

// Export the Mentor model for use in the application.
const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
