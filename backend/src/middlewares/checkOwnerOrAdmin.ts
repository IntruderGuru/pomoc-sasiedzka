// src/middlewares/checkOwnerOrAdmin.ts

import { UUID } from 'crypto';
import { NextFunction, Response } from 'express';

import { db } from '../database/connection';
import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';
import { logger } from '../utils/logger';
import { AuthRequest } from './authMiddleware';

// Instantiate repository so we can fetch announcements by ID
const announcementRepo = new AnnouncementRepository(db);

/**
 * Middleware to ensure that the authenticated user is either:
 *   - the owner of the announcement being modified/deleted,
 *   - or has the 'admin' role.
 *
 * Must be used after `checkAuth`, which populates `req.user`.
 */
export async function checkOwnerOrAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    // Reject if there's no authenticated user (should not happen if checkAuth ran)
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: missing user' });
    }
    const { userId, role } = req.user;

    // Extract the announcement ID from route params
    const announcementId = req.params.id;
    if (!announcementId) {
        return res.status(400).json({ message: 'Missing announcement ID' });
    }

    // Fetch the announcement from the database
    let announcement;
    try {
        announcement = await announcementRepo.getById(announcementId as UUID);
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Fetched announcement:', announcement);
    // If announcement does not exist, respond with 404 Not Found
    if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
    }

    // Allow if the requester is the owner or has admin privileges
    if (announcement.userId !== userId && role !== 'admin') {
        logger.error(
            `Forbidden: ${userId} tried to access ${announcement.userId}`
        );
        return res.status(403).json({ message: 'Forbidden' });
    }

    // All checks passed — proceed to the next middleware or route handler
    next();
}
