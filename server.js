import express from "express";
import config from "./config/config.js";
import usersRouter from "./routes/users.js";
import mentorsRouter from "./routes/mentors.js";
import mentorRequestRouter from "./routes/mentorRequest.js";

const api = express();

// add request body json parser
api.use(express.json());

// serve static images from profileImage
api.use("/profileImage", express.static("public/profileImage"));

// insert the routes
api.use("/users", usersRouter);
api.use("/mentors", mentorsRouter);
api.use("/mentor_request", mentorRequestRouter);

api.listen(config.port, () => {
  console.log(`✅ API server is listening on port: ${config.port}`);
});
