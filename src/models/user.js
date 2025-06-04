import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * @description userschema defines the mongodb schema
 * @property {String} name - name of the user
 * @property {String} fatherName - father name of the user
 * @property {string} email - email of the user, Unique
 * @property {string} password - hashed password of the user
 * @property {String} phoneNumber - phone number of the user
 */
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt time stam
  { versionKey: "__v" }, // Automatical creates and update version of the schema
);

const User = mongoose.model("User", userSchema);
export default User;
