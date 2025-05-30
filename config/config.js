// Centralized configuration
import * as fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Get url and directory to this config file
const currentFileName = fileURLToPath(import.meta.url);
const currentDirName = path.dirname(currentFileName);

// Get the app environment from process and state the location of the .env file
const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = path.resolve(currentDirName, `../.env.${NODE_ENV}`);

// Check if the .env file is exists and config it
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log();
}
