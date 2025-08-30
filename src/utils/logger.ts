import { createLogger, format, transports } from "winston";
import path from "path";

const logFormat = format.printf(({ timestamp, level, message, stack }) => {
  return `[${timestamp}] [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: "silly",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat()
  ),
  transports: [
    new transports.Console({
      level: "silly",
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      format: logFormat,
    }),
    new transports.File({
      filename: path.join("logs", "warn.log"),
      level: "warn",
      format: logFormat,
    }),
    new transports.File({
      filename: path.join("logs", "info.log"),
      level: "info",
      format: logFormat,
    }),
    new transports.File({
      filename: path.join("logs", "http.log"),
      level: "http",
      format: logFormat,
    }),
    new transports.File({
      filename: path.join("logs", "silly.log"),
      level: "silly",
      format: logFormat,
    }),
    new transports.File({
      filename: path.join("logs", "combined.log"),
      format: logFormat,
    }),
  ],
});

export default logger;
