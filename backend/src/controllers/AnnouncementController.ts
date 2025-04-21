import { Request, Response } from 'express';
import { db } from '../database/connection';
import { AnnouncementRepository } from '../database/repositories/AnnouncementRepository';
import { AnnouncementService } from '../services/AnnouncementService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UUID } from 'crypto';

const service = new AnnouncementService(new AnnouncementRepository(db));

export class AnnouncementController {
    static async create(req: AuthRequest, res: Response) {
        const { userId } = req.user;
        const { title, content } = req.body;
        try {
            const data = await service.create(
                userId as UUID,
                title,
                content,
                'none',
                'none'
            );
            res.status(201).json(data);
        } catch (e) {
            res.status(400).json({
                error:
                    e instanceof Error ? e.message : 'An unknown error occurred'
            });
        }
    }

    static async getAll(req: Request, res: Response) {
        const announcements = await service.getAll();
        res.json(announcements);
    }

    static async getById(req: Request, res: Response) {
        const announcement = await service.getById(req.params.id as UUID);
        if (!announcement)
            return res.status(404).json({ message: 'Not found' });
        res.json(announcement);
    }

    static async update(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const { title, content, category, type } = req.user;
        try {
            await service.update(id as UUID, title, content, category, type);
        } catch (e) {
            res.status(403).json({
                error:
                    e instanceof Error ? e.message : 'An unknown error occurred'
            });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        const { id } = req.params;
        try {
            await service.delete(id as UUID);
            res.status(204).send();
        } catch (e) {
            res.status(403).json({
                error:
                    e instanceof Error ? e.message : 'An unknown error occurred'
            });
        }
    }
}
