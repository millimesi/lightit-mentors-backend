import express from "express";
import config from "./config/config.js";
import insertRoutes from "./routes/index.js";

// const port = process.env.SERVER_PORT || 4000;

const api = express();

// add request body json parser
api.use(express.json());

// serve static images from profileImage
api.use("/profileImage", express.static("public/profileImage"));

// insert the routes
insertRoutes(api);

api.listen(config.port, () => {
  console.log(`✅ API server is listening on port: ${config.port}`);
});
