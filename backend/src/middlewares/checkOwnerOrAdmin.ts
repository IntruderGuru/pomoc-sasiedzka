import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';
import { logger } from '../utils/logger';

import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';
import { CommentRepository } from '../repositories/comment/CommentRepository';
import { ReactionRepository } from '../repositories/reaction/ReactionRepository';
import { db } from '../database/connection';
import { UUID } from 'crypto';

// Instantiate repositories (expandable for future ownership checks on other models)
const announcementRepo = new AnnouncementRepository(db);
const commentRepo = new CommentRepository(db);
const reactionRepo = new ReactionRepository(db);

/**
 * Middleware to restrict access to users who are either:
 *   - the owner of the resource (announcement),
 *   - or an admin.
 * 
 * Assumes that `checkAuth` middleware has already validated the user
 * and attached `req.user` to the request object.
 * 
 * Currently used for validating permissions on announcement modification/deletion.
 *
 * @param req - Authenticated request containing `user` and route param `id`
 * @param res - Express response object
 * @param next - Function to pass control to the next middleware
 */
export async function checkOwnerOrAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Reject if no authenticated user (should not happen if checkAuth ran)
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: missing user' });
    }

    const { userId, role } = req.user;

    // Extract the resource ID from route params
    const announcementId = req.params.id;
    if (!announcementId) {
        return res.status(400).json({ message: 'Missing announcement ID' });
    }

    // Attempt to fetch the announcement by ID
    let announcement;
    try {
        announcement = await announcementRepo.findById(announcementId as UUID);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Fetched announcement:', announcement);

    // Respond with 404 if the announcement does not exist
    if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
    }

    // Allow if the user is the owner or has admin privileges
    if (announcement.userId !== userId && role !== 'admin') {
        logger.error(`Forbidden: ${userId} tried to access ${announcement.userId}`);
        return res.status(403).json({ message: 'Forbidden' });
    }

    // Authorization passed — continue to the next middleware
    next();
}
