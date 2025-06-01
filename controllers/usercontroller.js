// User endpoints controllers
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config/config.js";
import AppError from "../utils/appError.js"; // Make sure this path is correct

export default class UserController {
  static async postNewUser(req, res, next) {
    console.log("POST /users is Accessed");
    const data = req.cleanData;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return next(new AppError("user exists", 400));
      }
    } catch (err) {
      return next(new AppError("Database error", 500));
    }

    // Hash the password
    data.password = await bcrypt.hash(data.password, 10);

    // Save the user to the database
    try {
      const newUser = new User(data);
      const insertInfo = await newUser.save();
      res.status(200).json({ email: insertInfo.email, id: insertInfo._id });
    } catch (err) {
      return next(new AppError("Database error", 500));
    }
  }

  static async getUserById(req, res, next) {
    console.log("GET /users/:id is Accessed");
    const id = req.params.id;

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid mentor ID format.", 400));
    }

    try {
      // Find user by ID
      const user = await User.findById(id);
      if (!user) {
        return next(new AppError("user not found", 400));
      }
      // Remove password from user object
      const userWithOutPassword = user.toObject();
      delete userWithOutPassword.password;
      res.status(200).json({ user: userWithOutPassword });
    } catch (err) {
      return next(new AppError("server error occurred", 500));
    }
  }

  static async updateUserById(req, res, next) {
    console.log("PUT /users/:id is Accessed");
    const userid = req.params.id;

    try {
      // Find user by ID
      const user = await User.findById(userid);
      if (!user) {
        return next(new AppError("user not found", 404));
      }
      // Update user data
      const updateData = req.body;
      await User.updateOne(
        { _id: userid },
        { $set: updateData },
        { upsert: false, runValidators: true },
      );
      res.status(200).json({ message: "user updated successfully" });
    } catch (err) {
      return next(new AppError("server error occurred", 500));
    }
  }

  static async deleteById(req, res, next) {
    console.log("DELETE /users/:id is Accessed");
    const userid = req.params.id;

    try {
      // Delete user by ID
      const result = await User.deleteOne({ _id: userid });
      if (result.deletedCount === 0) {
        return next(new AppError("User not found", 404));
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      return next(new AppError("Server error occurred", 500));
    }
  }

  static async userLogin(req, res, next) {
    console.log("POST /users/login is Accessed");
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;

    try {
      // Find user by email
      const user = await User.findOne({ email: reqEmail });
      if (!user) {
        return next(new AppError("user not found", 400));
      }
      // Compare provided password with stored hash
      if (!(await bcrypt.compare(reqPassword, user.password))) {
        return next(new AppError("incorrect password", 400));
      }
      // Generate JWT token
      const jwtpayload = { email: user.email };
      const accessToken = jwt.sign(jwtpayload, config.jwtSecret);
      res.status(200).json({ message: "login successful", accessToken });
    } catch (err) {
      return next(new AppError("Server error occurred", 500));
    }
  }
}
