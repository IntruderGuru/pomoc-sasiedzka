import { db } from '../database/connection';
import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';
import { CommentRepository } from '../repositories/comment/CommentRepository';
import { AuditLogRepository } from '../repositories/audit/AuditLogRepository';
import { ModerationService } from '../services/ModerationService';

export const service = new ModerationService(
    new AnnouncementRepository(db),
    new CommentRepository(db),
    new AuditLogRepository()
);
