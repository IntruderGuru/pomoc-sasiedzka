import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { ReactionService } from '../services/ReactionService';
import { ReactionRepository } from '../repositories/reaction/ReactionRepository';
import { db } from '../database/connection';
import { UUID } from 'crypto';

// Instantiate the service layer with an injected ReactionRepository instance.
// This maintains separation of concerns between transport and domain logic.
const service = new ReactionService(new ReactionRepository(db));

/**
 * Controller responsible for managing user reactions (like/dislike)
 * on announcements and comments.
 * All endpoints require authentication.
 */
export class ReactionController {

    /**
     * POST /api/announcements/:id/reactions
     * Adds a like or dislike reaction to a specific announcement.
     * 
     * @param req - Authenticated request with `type` in the body
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static addToAnnouncement = async (req: AuthRequest, res: Response, next: Function) => {
        try {
            const { type } = req.body;
            const r = await service.addToAnnouncement(req.user!.userId as UUID, req.params.id, type);
            res.status(201).json(r); // Return newly added reaction
        } catch (e) {
            next(e);
        }
    };

    /**
     * DELETE /api/announcements/:id/reactions
     * Removes a user's reaction from a specific announcement.
     * 
     * @param req - Authenticated request with announcement ID
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static removeFromAnnouncement = async (req: AuthRequest, res: Response, next: Function) => {
        try {
            await service.removeFromAnnouncement(req.user!.userId as UUID, req.params.id);
            res.status(204).send(); // No content on successful delete
        } catch (e) {
            next(e);
        }
    };

    /**
     * POST /api/comments/:id/reactions
     * Adds a reaction to a specific comment (like/dislike).
     * 
     * @param req - Authenticated request with `type` in the body
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static addToComment = async (req: AuthRequest, res: Response, next: Function) => {
        try {
            const { type } = req.body;
            const r = await service.addToComment(req.user!.userId as UUID, req.params.id, type);
            res.status(201).json(r);
        } catch (e) {
            next(e);
        }
    };

    /**
     * DELETE /api/comments/:id/reactions
     * Removes a user's reaction from a specific comment.
     * 
     * @param req - Authenticated request with comment ID
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static removeFromComment = async (req: AuthRequest, res: Response, next: Function) => {
        try {
            await service.removeFromComment(req.user!.userId as UUID, req.params.id);
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    };
}
