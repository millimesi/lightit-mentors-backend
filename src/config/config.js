// Centralized configuration
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import logger from "./logger.js";

// Get url and directory to this config file
const currentFileName = fileURLToPath(import.meta.url);
const currentDirName = path.dirname(currentFileName);

// Get the app environment from process and state the location of the .env file
const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = path.resolve(currentDirName, `../../.env.${NODE_ENV}`);

// Check if the .env file is exists and config it
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  logger.info(`✅ Loaded environment: ${NODE_ENV}`);
} else {
  throw new Error(`❌ .env file is not found: ${envPath}`);
}

// Config Environment variable and export
export default {
  env: process.env.NODE_ENV,
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  port: process.env.SERVER_PORT,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbAuthSource: process.env.DB_AUTHSOURCE,
};
