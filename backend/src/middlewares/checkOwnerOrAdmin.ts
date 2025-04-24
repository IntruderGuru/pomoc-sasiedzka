import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';
import { logger } from '../utils/logger';

/**
 * Middleware to ensure that the authenticated user is either:
 *   - the owner of the resource (e.g., owns the announcement or user profile),
 *   - or has the 'admin' role.
 * 
 * This is typically used for update/delete actions on resources tied to a specific user ID.
 * It should always be used after the `checkAuth` middleware, which populates `req.user`.
 */
export function checkOwnerOrAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Reject request if no authenticated user is found (shouldn't happen if `checkAuth` ran)
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: missing user' });
    }

    const { userId, role } = req.user;

    /**
     * Determine the "target" userId that the action is attempting to access or modify.
     * This ID might come from the request body (e.g., on update) or the route parameters.
     */
    const targetUserId = req.body.userId || req.params.userId;

    /**
     * If the authenticated user is neither the owner of the resource
     * nor an admin, reject with a 403 Forbidden.
     */
    if (userId !== targetUserId && role !== 'admin') {
        logger.error(`Forbidden: ${userId} tried to access ${targetUserId}`);
        return res.status(403).json({ message: 'Forbidden' });
    }

    // User is either the owner or an admin — allow the request to proceed
    next();
}
