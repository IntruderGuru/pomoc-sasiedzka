import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { service } from './_sharedModerationService';
import { UUID } from 'crypto';

export class AnnouncementModerationController {
    static async get(req: AuthRequest, res: Response) {
        res.json(await service.getAnnouncements(req.query.status as any));
    }

    static async updateStatus(req: AuthRequest, res: Response) {
        const { status } = req.body;
        const id = req.params.id as UUID;

        if (status === 'approved') {
            await service.approve(req.user!.userId as UUID, id);
        } else if (status === 'rejected') {
            await service.reject(req.user!.userId as UUID, id);
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }
        res.status(204).send();
    }
}
