import { UUID } from 'crypto';
import { Request, Response } from 'express';

import { db } from '../database/connection';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';
import { AnnouncementService } from '../services/AnnouncementService';
import { logger } from '../utils/logger';
// Instantiate the service layer with the repository injected.
// This allows controller logic to remain thin and offload business rules to the service.
const service = new AnnouncementService(new AnnouncementRepository(db));

/**
 * Controller responsible for handling HTTP requests related to announcements.
 * Delegates all core logic to AnnouncementService and communicates results to the client.
 */
export class AnnouncementController {
    /**
     * POST /api/announcements
     * Creates a new announcement associated with the currently authenticated user.
     */
    static async create(req: AuthRequest, res: Response) {
        try {
            const { title, content, category, type } = req.body;

            if (!req.user) {
                // User must be authenticated
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Pass input to the service layer for validation and persistence
            const data = await service.create(
                req.user.userId,
                title,
                content,
                category,
                type
            );

            return res.status(201).json(data);
        } catch (e: any) {
            logger.error(e);
            return res.status(400).json({ error: e.message });
        }
    }

    /**
     * GET /api/announcements
     * Retrieves all announcements, optionally filtered by category and type.
     * No authentication required.
     */
    static async getAll(req: Request, res: Response) {
        try {
            const { category, type } = req.query as any;

            const data = await service.getAll({ category, type });

            return res.json(data);
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /api/users/:id/announcements
     * Fetches all announcements created by a specific user (ID provided as URL param).
     * Requires authentication.
     */
    static async getByUser(req: Request, res: Response) {
        try {
            const data = await service.getByUser(req.params.id);
            return res.json(data);
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /api/admin/announcements
     * Retrieves all announcements with author metadata (admin-only access).
     * Requires valid JWT and admin role.
     */
    static async getAllForAdmin(req: AuthRequest, res: Response) {
        try {
            const data = await service.getAllForAdmin();
            return res.json(data);
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /api/categories
     * Returns a distinct list of all used categories in announcements.
     * No authentication required.
     */
    static async getCategories(_req: Request, res: Response) {
        try {
            const cats = await service.getCategories();
            return res.json(cats);
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /api/announcements/:id
     * Updates an existing announcement by ID. The request is allowed if:
     *  - The user is the announcement's owner
     *  - OR the user has admin privileges
     * Authorization logic is handled by middleware.
     */
    static async update(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const { title, content, category, type } = req.body;
        try {
            console.log(
                `Updating announcement ${id} with title "${title}", content "${content}", category "${category}", type "${type}"`);
            const updated = await service.update(
                id as UUID,
                title,
                content,
                category,
                type,
            );
            console.log('Updated announcement:', updated);
            return res.status(200).json(updated);
        } catch (e) {
            const errorMessage = (e as Error).message;

            // Map domain errors to HTTP status codes
            const status =
                errorMessage === 'Not found'
                    ? 404
                    : errorMessage === 'Forbidden'
                        ? 403
                        : 400;

            return res
                .status(status)
                .json({ error: errorMessage || 'An unknown error occurred' });
        }
    }

    static async findById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const announcement = await service.findById(id as UUID);
            if (!announcement) {
                return res
                    .status(404)
                    .json({ error: 'Announcement not found' });
            }
            return res.json(announcement);
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * DELETE /api/announcements/:id
     * Deletes an announcement by ID. Permission logic is delegated to middleware:
     * Only owners or admins can delete.
     */
    static async delete(req: AuthRequest, res: Response) {
        const { id } = req.params;

        try {
            await service.delete(id as UUID);
            res.status(204).send(); // No content response
        } catch (e: any) {
            logger.error(e);
            return res.status(403).json({ error: e.message });
        }
    }

    /**
     * GET /api/me
     * Returns the decoded JWT payload of the currently authenticated user.
     * Used primarily for checking current session state on the frontend.
     */
    static async getMe(req: AuthRequest, res: Response) {
        return res.json({ user: req.user });
    }
}
