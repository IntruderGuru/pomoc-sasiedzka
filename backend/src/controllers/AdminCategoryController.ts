import { Request, Response } from 'express';
import { db } from '../database/connection';
import { CategoryRepository } from '../repositories/category/CategoryRepository';
import { AuditLogRepository } from '../repositories/audit/AuditLogRepository';
import { CategoryService } from '../services/CategoryService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UUID } from 'crypto';

const service = new CategoryService(
    new CategoryRepository(db),
    new AuditLogRepository()
);

export class AdminCategoryController {
    static getAll(_req: Request, res: Response) {
        service.getAll().then(res.json.bind(res));
    }

    static async create(req: AuthRequest, res: Response) {
        const cat = await service.create(req.user!.userId as UUID, req.body.name);
        res.status(201).json(cat);
    }

    static async update(req: AuthRequest, res: Response) {
        const cat = await service.update(
            req.user!.userId as UUID,
            req.params.id as UUID,
            req.body.name
        );
        res.json(cat);
    }

    static async delete(req: AuthRequest, res: Response) {
        await service.delete(req.user!.userId as UUID, req.params.id as UUID);
        res.status(204).send();
    }
}
