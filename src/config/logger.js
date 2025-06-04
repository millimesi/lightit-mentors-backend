import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";
import "winston-daily-rotate-file";

// Get url and directory to this config file
const currentFileName = fileURLToPath(import.meta.url);
const currentDirName = path.dirname(currentFileName);

// Ensure logs folder exists
const logDir = path.resolve(currentDirName, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create a daily rotate file transport (combined)
const combinedTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "combined-%DATE%.log"),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // Compress old logs
  maxSize: "20m", // Rotate if larger than 20 mega bits reaches
  maxFiles: "14d", // Delete logs older than 14 days
  level: "info",
});

// Error-only transport
const errorTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "error-%DATE%.log"),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // Compress old logs
  maxSize: "20m", // Rotate if larger than 20 mega bits reaches
  maxFiles: "30d", // Delete logs older than 14 days
  level: "error",
});

// Console transport (readable for dev)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} ${level}: ${stack || message}`;
    }),
  ),
});

// Uncaught Error transporter
const uncaughtTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "exceptional-error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // Compress old logs
  maxSize: "20m", // Rotate if larger than 20 mega bits reaches
  maxFiles: "30d", // Delete logs older than 14 days
  level: "error",
});

// Uncaught promise rejection transporter
const rejectionTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "rejection-error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // Compress old logs
  maxSize: "20m", // Rotate if larger than 20 mega bits reaches
  maxFiles: "30d", // Delete logs older than 14 days
  level: "error",
}); // uncaught promise rejections

// logger function
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }), // logs full error
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [combinedTransport, errorTransport, consoleTransport],
  exceptionHandlers: [uncaughtTransport, consoleTransport],
  rejectionHandlers: [rejectionTransport, consoleTransport],
});

// Stream for morgan (request logging)
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
