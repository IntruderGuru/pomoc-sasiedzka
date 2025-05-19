import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { db } from '../database/connection';
import { UserRepository } from '../repositories/user/UserRepository';
import { AuditLogRepository } from '../repositories/audit/AuditLogRepository';
import { AdminUserService } from '../services/AdminUserService';
import { UUID } from 'crypto';

const service = new AdminUserService(
    new UserRepository(db),
    new AuditLogRepository()
);

export class AdminUserController {
    static async getAll(_req: AuthRequest, res: Response) {
        res.json(await service.getAllUsers());
    }

    static async updateRole(req: AuthRequest, res: Response) {
        await service.updateRole(
            req.user!.userId as UUID,
            req.params.id as UUID,
            req.body.role
        );
        res.status(204).send();
    }

    // static async deactivate(req: AuthRequest, res: Response) {
    //     await service.deactivateUser(
    //         req.user!.userId as UUID,
    //         req.params.id as UUID
    //     );
    //     res.status(204).send();
    // }
}
