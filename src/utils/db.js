// Database connection and management
import logger from "../config/logger.js";
import mongoose from "mongoose";
import config from "../config/config.js";

export default class DbClient {
  static async connect() {
    try {
      // Set database url parameters
      const dbUrl = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=${config.dbAuthSource}`;

      // Connect to the data base
      await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`✅ Database connection is established`);

      // Close the connection when the program is terminated
      process.on("SIGINT", async () => {
        try {
          await mongoose.connection.close();
          logger.info(
            "🛑 Database connection is closed due to program termination!",
          );
          process.exit(0);
        } catch (err) {
          logger.error("❌ Error closing the database connection:", err);
          process.exit(1);
        }
      });

      return true;
    } catch (error) {
      logger.error("❌ DataBase Connection error:", error);
    }
  }
}
