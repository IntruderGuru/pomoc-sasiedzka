import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CommentService } from '../services/CommentService';
import { CommentRepository } from '../repositories/comment/CommentRepository';
import { db } from '../database/connection';

// Instantiate the CommentService with the CommentRepository.
// This separates business logic from controller logic.
const service = new CommentService(new CommentRepository(db));

/**
 * Controller responsible for handling HTTP requests related to comments.
 * Delegates business rules and validation to CommentService.
 */
export class CommentController {

    /**
     * POST /api/announcements/:id/comments
     * Adds a new comment to the specified announcement.
     * Requires authentication (AuthRequest).
     *
     * @param req - Authenticated request containing `content` and announcement `id` in params
     * @param res - HTTP response object
     * @param next - Express error handling middleware
     */
    static async addComment(req: AuthRequest, res: Response, next: Function) {
        try {
            const { content } = req.body;
            const comment = await service.addComment(req.user!.userId, req.params.id, content);
            res.status(201).json(comment); // Respond with created comment
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /api/announcements/:id/comments
     * Fetches all comments for a specific announcement.
     * Requires authentication to prevent abuse.
     *
     * @param req - Authenticated request with announcement ID in URL params
     * @param res - HTTP response object
     * @param next - Express error handler
     */
    static async getComments(req: AuthRequest, res: Response, next: Function) {
        try {
            const list = await service.getComments(req.params.id);
            res.json(list); // Return array of comment objects
        } catch (e) {
            next(e);
        }
    }

    /**
     * DELETE /api/comments/:id
     * Deletes a comment by ID.
     * Only the comment's author or an admin can delete.
     *
     * @param req - Authenticated request with comment ID in params
     * @param res - HTTP response object
     * @param next - Express error handler
     */
    static async deleteComment(req: AuthRequest, res: Response, next: Function) {
        try {
            await service.deleteComment(req.params.id, req.user!.userId, req.user!.role);
            res.status(204).send(); // No content on success
        } catch (e) {
            next(e);
        }
    }
}
