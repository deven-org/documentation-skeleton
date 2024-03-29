export * from "./commands/";
import { logger } from "./Logger";

process.on("uncaughtException", (err) => {
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});
