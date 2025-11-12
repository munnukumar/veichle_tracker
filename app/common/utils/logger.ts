import winston from 'winston';
import { Request, Response } from 'express';

// Define a custom log format
const logFormat = winston.format.printf(({ timestamp, level, message, statusCode, route, stack }) => {
  // Build the log message based on the parameters
  let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

  // If the error includes status code, append it
  if (statusCode) {
    logMessage += ` | Status Code: ${statusCode}`;
  }

  // Include the full route (method and URL)
  if (route) {
    logMessage += ` | Route: ${route}`;
  }

  // If there's a stack trace, include it as well
  if (stack) {
    logMessage += `\nStack Trace: ${stack}`;
  }

  return logMessage;
});

// Create a new Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Default log level is 'info', you can change it to 'debug', 'warn', etc.
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp for logs
    logFormat // Apply custom log format
  ),
  transports: [
    // Console transport for development (for easy reading)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add color to logs
        winston.format.simple() // Simple log format for console
      ),
    }),

    // File transport for error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // Only log error level and above
    }),

    // File transport for general logs (optional)
    new winston.transports.File({
      filename: 'logs/combined.log', // This file will contain both info and error logs
    }),
  ],
});

// If we're in development, log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
