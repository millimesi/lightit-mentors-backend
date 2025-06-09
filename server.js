import express from "express";
import morgan from "morgan";
import logger from "./src/config/logger.js";
import usersRouter from "./src/routes/users.js";
import mentorsRouter from "./src/routes/mentors.js";
import mentorRequestRouter from "./src/routes/mentorRequest.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";
import helmet from "helmet";
import cors from "cors";
import startServer from "./src/server/startServer.js";

const api = express();

// Enable CORS for all routes
api.use(cors());

// http logger
api.use(morgan("combined", { stream: logger.stream }));

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

// Start Server
startServer(api);
