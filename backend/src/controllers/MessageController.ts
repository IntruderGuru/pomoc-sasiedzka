import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { MessageService } from '../services/MessageService';
import { MessageRepository } from '../repositories/message/MessageRepository';
import { db } from '../database/connection';

// Instantiate the MessageService with a connected MessageRepository.
// Separates transport logic (controllers) from business logic (service).
const service = new MessageService(new MessageRepository(db));

/**
 * Controller responsible for handling private message functionality.
 * Endpoints include sending messages and fetching conversation threads.
 */
export class MessageController {

    /**
     * POST /api/messages
     * Sends a private message from the currently authenticated user to a recipient.
     * 
     * @param req - Authenticated request containing `receiverId` and `content`
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static async sendMessage(req: AuthRequest, res: Response, next: Function) {
        try {
            const { receiverId, content } = req.body;

            if (!receiverId) {
                return res.status(400).json({ message: 'receiverId required' });
            }

            const msg = await service.sendMessage(req.user!.userId, receiverId, content);
            res.status(201).json(msg);
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /api/messages/conversations
     * Returns the most recent message per unique conversation for the authenticated user.
     * 
     * @param req - Authenticated request
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static async getConversations(req: AuthRequest, res: Response, next: Function) {
        try {
            const data = await service.getConversations(req.user!.userId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /api/messages/:withuserId
     * Retrieves the full message thread between the authenticated user and another user.
     * Messages are returned in chronological order.
     * 
     * @param req - Authenticated request with `withuserId` in URL params
     * @param res - HTTP response
     * @param next - Express error handler
     */
    static async getThread(req: AuthRequest, res: Response, next: Function) {
        try {
            const other = req.params.withuserId;
            const data = await service.getThread(req.user!.userId, other);

            res.json(data);
        } catch (e) {
            next(e);
        }
    }


}
