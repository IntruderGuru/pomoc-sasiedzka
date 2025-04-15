import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export function checkOwnerOrAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    const { userId, role } = req.user;
    const targetUserId = req.body.userId || req.params.userId;

    if (userId !== targetUserId && role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}
