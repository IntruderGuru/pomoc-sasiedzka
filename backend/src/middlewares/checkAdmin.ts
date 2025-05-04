import { NextFunction, Response } from 'express';

import { AuthRequest } from './authMiddleware';

/**
 * Middleware to restrict access to administrator-only routes.
 * Requires that `checkAuth` has already run, and `req.user` is populated.
 *
 * This is typically used after authentication middleware in route chains, e.g.:
 *   app.get('/admin/dashboard', checkAuth, checkAdmin, handler);
 */
export function checkAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Check if the authenticated user has the 'admin' role
    if (req.user?.role !== 'admin') {
        // Respond with 403 Forbidden if the user is not an admin
        return res.status(403).json({ message: 'Forbidden' });
    }

    // Proceed to the next middleware or route handler
    next();
}
