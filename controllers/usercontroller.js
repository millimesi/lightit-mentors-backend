// User endpoints controllers
import User from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export default class UserController {
  // Create new user
  // POST /users
  static async postNewUser(req, res) {
    console.log("POST /users is Accessed");
    const data = req.body;

    // check if every user parameter is inserted
    if (!data.email) {
      return res.status(400).json({ error: "Missing email" });
    }

    if (!data.name) {
      return res.status(400).json({ error: "Missing name" });
    }

    if (!data.fatherName) {
      return res.status(400).json({ error: "Missing fatherName" });
    }

    if (!data.password) {
      return res.status(400).json({ error: "Missing user password" });
    }

    // Validate the email
    // if (!(validator.isEmail(data.email))) {
    //     return res.status(400).json({ error: 'Invalid Email'});
    // }

    // find the user from the database and return error if it exists
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return res.status(400).json({ error: "user exists" });
      }
    } catch (err) {
      console.log(`Error: ${err}`);
    }

    // hash the password
    data.password = await bcrypt.hash(data.password, 10);

    // save the user to the data base
    try {
      const newUser = new User(data);
      const insertInfo = await newUser.save();

      res.status(200).json({ email: insertInfo.email, id: insertInfo._id });
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  static async getUserById(req, res) {
    console.log("GET /users/:id is Accessed");

    // Get the id from request paramete
    const id = req.params.id;

    // retrive the user from the data base
    try {
      const user = await User.findById(id);

      // if there is no user with that id return Error
      if (!user) {
        return res.status(400).json({ error: "user not found" });
      }

      // remove the password from the user
      const userWithOutPassword = user.toObject();
      delete userWithOutPassword.password;

      // else send the user data
      res.status(200).json({ user: userWithOutPassword });
    } catch (err) {
      console.log(`Error ${err}`);
      res.status(500).json({ error: "server error occured" });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async updateUserById(req, res) {
    console.log("PUT /users/:id is Accessed");

    // get the Id
    const userid = req.params.id;

    // first Check it if the user exists with data
    try {
      const user = await User.findById(userid);

      // if there is no user with that id return Error
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }

      // get the update data
      const updateData = req.body;

      // update the data
      const updateInfo = await User.updateOne(
        { _id: userid },
        { $set: updateData },
        { upsert: false, runValidators: true } // upsert false forbids creation of new doc
        // run validation on the update data
      );

      res.status(200).json({ message: "user updated successfully" });
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "server error occurred" });
    }
  }

  static async deleteById(req, res) {
    console.log("DELETE /users/:id is Accessed");

    // Get the Id
    const userid = req.params.id;

    try {
      // Perform the delete operation
      const result = await User.deleteOne({ _id: userid });

      // Check if a document was deleted
      if (result.deletedCount === 0) {
        // No document was deleted, meaning the ID was not found
        return res.status(404).json({ error: "User not found" });
      }

      // Document was deleted successfully
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }

  static async userLogin(req, res) {
    console.log("POST /users/login is Accessed");

    // get the password and user email from the request body
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;

    // find the user from the database
    try {
      const user = await User.findOne({ email: reqEmail });

      // console.log(user);
      // if user is null retun not found error
      if (!user) {
        return res.status(400).json({ error: "user not found" });
      }

      // if user found comare the password with reqPassword by bcrypt
      // if comparision passes respond login sussesfull else incorrect password
      if (!(await bcrypt.compare(reqPassword, user.password))) {
        return res.status(400).json({ error: "incorrect password" });
      }

      // create jwt ( access token)
      const jwtpayload = { email: user.email };
      const accessToken = jwt.sign(jwtpayload, process.env.ACCESS_TOKEN_SECRET); // is not set { expiresIn: '15m' }

      res.status(200).json({ message: "login successful", accessToken });
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ error: "Server error occurred" });
    }
  }
}
