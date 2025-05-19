import { UUID } from 'crypto';
import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';
import { CommentRepository } from '../repositories/comment/CommentRepository';
import { AuditLogRepository } from '../repositories/audit/AuditLogRepository';

export class ModerationService {
    constructor(
        private ann: AnnouncementRepository,
        private com: CommentRepository,
        private audit: AuditLogRepository
    ) { }

    getAnnouncements() {
        console.log('getAnnouncements');
        return this.ann.getAllAnnouncements;
    }

    // async approve(adminId: UUID, id: UUID) {
    //     await this.ann.updateStatus(id, 'approved');
    //     // await this.audit.add(adminId, 'approve', 'announcement', id, null);
    // }
    // async reject(adminId: UUID, id: UUID) {
    //     await this.ann.updateStatus(id, 'rejected');
    //     // await this.audit.add(adminId, 'reject', 'announcement', id, null);
    // }

    getAllComments() {
        return this.com.getAllComments();
    }
    async deleteComment(adminId: UUID, id: UUID) {
        await this.com.deleteComment(id);
        // await this.audit.add(adminId, 'delete', 'comment', id, null);
    }
}
