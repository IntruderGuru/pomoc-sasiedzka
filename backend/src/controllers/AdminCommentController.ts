import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { service } from './_sharedModerationService';
import { UUID } from 'crypto';

export class AdminCommentController {
    static async getAll(_req: AuthRequest, res: Response) {
        res.json(await service.getAllComments());
    }
    static async delete(req: AuthRequest, res: Response) {
        await service.deleteComment(
            req.user!.userId as UUID,
            req.params.id as UUID
        );
        res.status(204).send();
    }
}
