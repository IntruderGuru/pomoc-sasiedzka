import { createLogger, format, transports } from 'winston';
import path from 'path';

/**
 * Application-wide logger instance configured with Winston.
 * Currently logs only errors to a file (`logs/error.log`) in timestamped, structured format.
 *
 * This logger can be extended with additional levels (info, warn, debug)
 * and transports (e.g., console, external services) as the app evolves.
 */
export const logger = createLogger({
    // Only messages with level 'error' or more severe will be logged
    level: 'error',

    // Define the output format
    format: format.combine(
        format.timestamp(), // Add ISO-formatted timestamp to each log entry
        format.errors({ stack: true }), // Ensure full stack traces are included for error objects
        format.printf(({ timestamp, level, message, stack }) =>
            `${timestamp} ${level}: ${stack || message}` // Custom log message format
        )
    ),

    // Define log destinations (transports)
    transports: [
        // Log error messages to 'logs/error.log' file
        new transports.File({ filename: path.join('logs', 'error.log') })
    ]
});
