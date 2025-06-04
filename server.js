import express from "express";
import morgan from "morgan";
import logger from "./src/config/logger.js";
import config from "./src/config/config.js";
import usersRouter from "./src/routes/users.js";
import mentorsRouter from "./src/routes/mentors.js";
import mentorRequestRouter from "./src/routes/mentorRequest.js";
import errorHandler from "./src/middlewares/errorMiddleware.js";
import helmet from "helmet";

const api = express();

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

api.listen(config.port, () => {
  logger.info(`✅ API server is listening on port: ${config.port}`);
});
