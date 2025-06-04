import express from "express";
import config from "./config/config.js";
import usersRouter from "./routes/users.js";
import mentorsRouter from "./routes/mentors.js";
import mentorRequestRouter from "./routes/mentorRequest.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import helmet from "helmet";

const api = express();

// Apply helmet middleware globally
api.use(helmet());

// Add request body json parser
api.use(express.json());

// Serve static images from profileImage
api.use("/profileImage", express.static("public/profileImage"));

// Insert the routes
api.use("/users", usersRouter);
api.use("/mentors", mentorsRouter);
api.use("/mentor_request", mentorRequestRouter);

// Error handler
api.use(errorHandler);

api.listen(config.port, () => {
  console.log(`✅ API server is listening on port: ${config.port}`);
});
