import { Request, Response } from 'express';
import { db } from '../database/connection';
import { AnnouncementRepository } from '../database/repositories/AnnouncementRepository';
import { AnnouncementService } from '../services/AnnouncementService';
import { AuthRequest } from '../middlewares/authMiddleware';

const service = new AnnouncementService(new AnnouncementRepository(db));

export class AnnouncementController {
    static async create(req: AuthRequest, res: Response) {
        try {
            const data = await service.create({ ...req.body, userId: req.user.userId });
            res.status(201).json(data);
        } catch (e) {
            res.status(400).json({ error: e instanceof Error ? e.message : 'An unknown error occurred' });
        }
    }

    static async getAll(_req: Request, res: Response) {
        const announcements = await service.getAll();
        res.json(announcements);
    }

    static async getById(req: Request, res: Response) {
        const announcement = await service.getById(req.params.id);
        if (!announcement) return res.status(404).json({ message: 'Not found' });
        res.json(announcement);
    }

    static async update(req: AuthRequest, res: Response) {
        try {
            const updated = await service.update(req.params.id, req.user.userId, req.user.role, req.body);
            res.json(updated);
        } catch (e) {
            res.status(403).json({ error: e instanceof Error ? e.message : 'An unknown error occurred' });
        }
    }

    static async delete(req: AuthRequest, res: Response) {
        try {
            await service.delete(req.params.id, req.user.userId, req.user.role);
            res.status(204).send();
        } catch (e) {
            res.status(403).json({ error: e instanceof Error ? e.message : 'An unknown error occurred' });
        }
    }
}
