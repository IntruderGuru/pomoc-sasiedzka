import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Load environment variables from .env file into process.env
dotenv.config();

// Fallback to a default value if JWT_SECRET is not defined (recommended to override in production)
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

/**
 * Extended Request interface to include a `user` property.
 * This is populated during JWT verification and consumed by downstream middleware/controllers.
 */
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: 'user' | 'admin';
        iat: number; // Issued At timestamp (from JWT)
        exp: number; // Expiration timestamp (from JWT)
    };
}

/**
 * Middleware to validate JWT token from the Authorization header.
 * Ensures that only authenticated users can access protected routes.
 * 
 * Expected header format:
 *   Authorization: Bearer <token>
 */
export function checkAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        // Authorization header must be present
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Token is expected to follow the "Bearer <token>" format
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        // Validate the token using the secret. If invalid, an exception will be thrown.
        const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];

        // Store the decoded token data (userId, role, etc.) on the request object for later use
        req.user = decoded;

        // Pass control to the next middleware or route handler
        next();
    } catch (error) {
        // Token verification failed or was malformed
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
