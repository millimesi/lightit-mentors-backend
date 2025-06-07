import DbClient from "../utils/db.js";
import logger from "../config/logger.js";
import config from "../config/config.js";

// Server Starter function
async function startServer(api) {
  const connection = await DbClient.connect();

  if (!connection) {
    logger.error("🚫 Server Startup is aborted due to DB connection failure");
    process.exit(1);
  }
  api.listen(config.port, () => {
    logger.info(`🚀 Server listening on port ${config.port}`);
  });
}

export default startServer;
