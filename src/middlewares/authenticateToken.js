import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/appError.js";

dotenv.config();

function authenticateToken(req, res, next) {
  // get authorization token from the header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next(new AppError("Access needs authorization", 401));
  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(new AppError("Access unauthorized", 403));

    req.user = user; // Attach the decoded token payload to the request object
    next(); // Pass control to the next middleware function
  });
}

export default authenticateToken;
