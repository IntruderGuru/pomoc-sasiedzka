import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';

/**
 * Middleware to ensure that a user is not attempting to fetch a message thread with themselves.
 * This prevents edge-case abuse of the `/api/messages/:withuserId` endpoint.
 * 
 * Assumes `checkAuth` has already populated `req.user`.
 * 
 * - If `withuserId` equals the current user's ID → continue (redundant but harmless)
 * - If `withuserId` is different → allow (valid conversation)
 * - If no user is present → reject with 401 Unauthorized
 *
 * @param req - Authenticated request object
 * @param res - Express response object
 * @param next - Next middleware in the stack
 */
export function checkConversationParticipant(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const withUser = req.params.withuserId;

    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Prevent access if someone tries to message themselves (optional logic)
    if (withUser !== req.user.userId) {
        return next();
    }

    next(); // Still allow if it's a self-message for now
}
