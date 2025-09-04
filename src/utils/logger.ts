import { createLogger, format, transports } from "winston";
import path from "path";


// Renkler ve formatlar
const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray',
};

const levelFormats = {
  error: format.combine(
    format.colorize({ all: true, colors: { error: 'red' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
  warn: format.combine(
    format.colorize({ all: true, colors: { warn: 'yellow' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
  info: format.combine(
    format.colorize({ all: true, colors: { info: 'green' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
  http: format.combine(
    format.colorize({ all: true, colors: { http: 'magenta' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
  verbose: format.combine(
    format.colorize({ all: true, colors: { verbose: 'cyan' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
  debug: format.combine(
    format.colorize({ all: true, colors: { debug: 'blue' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
  silly: format.combine(
    format.colorize({ all: true, colors: { silly: 'gray' } }),
    format.printf(({ timestamp, level, message, stack }) =>
      `[${timestamp}] [${level}]: ${stack || message}`
    )
  ),
};

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
    // Her seviye için farklı renk ve format
    new transports.Console({
      level: "silly",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.splat(),
        format((info) => {
          // Seviyeye göre format uygula
          const fmt = levelFormats[info.level as keyof typeof levelFormats] || logFormat;
          return fmt.transform ? fmt.transform(info) : info;
        })()
      ),
    }),
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) =>
          `[${timestamp}] [ERROR]: ${stack || message}`
        )
      ),
    }),
    new transports.File({
      filename: path.join("logs", "warn.log"),
      level: "warn",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, stack }) =>
          `[${timestamp}] [WARN]: ${stack || message}`
        )
      ),
    }),
    new transports.File({
      filename: path.join("logs", "info.log"),
      level: "info",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, stack }) =>
          `[${timestamp}] [INFO]: ${stack || message}`
        )
      ),
    }),
    new transports.File({
      filename: path.join("logs", "http.log"),
      level: "http",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, stack }) =>
          `[${timestamp}] [HTTP]: ${stack || message}`
        )
      ),
    }),
    new transports.File({
      filename: path.join("logs", "silly.log"),
      level: "silly",
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, stack }) =>
          `[${timestamp}] [SILLY]: ${stack || message}`
        )
      ),
    }),
    new transports.File({
      filename: path.join("logs", "combined.log"),
      format: logFormat,
    }),
  ],
});

export default logger;
