import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { AuditLog } from '../../models/AuditLog';

export class AuditLogRepository {
    constructor(private db: Kysely<Database>) { }

    async getAuditLogs(
        announcementId?: UUID,
        commentId?: UUID
    ): Promise<AuditLog[]> {
        let qb = await this.db.selectFrom('audit_logs').selectAll();

        if (announcementId)
            qb = qb.where('announcement_id', '=', announcementId);
        if (commentId) qb = qb.where('comment_id', '=', commentId);

        const result = await qb.execute();

        return result.map(
            r =>
                new AuditLog(
                    r.id as UUID,
                    r.user_id as UUID,
                    r.action,
                    r.announcement_id as UUID,
                    r.comment_id as UUID,
                    r.created_at
                )
        );
    }

    async addAuditLog(
        userId: UUID,
        action: string,
        announcementId?: UUID,
        commentId?: UUID
    ): Promise<AuditLog> {
        const result = await this.db
            .insertInto('audit_logs')
            .values({
                id: crypto.randomUUID(),
                user_id: userId,
                action: action,
                announcement_id: announcementId,
                comment_id: commentId
            })
            .returning(['id', 'created_at'])
            .executeTakeFirstOrThrow();

        return new AuditLog(
            result.id as UUID,
            userId as UUID,
            action,
            announcementId as UUID,
            commentId as UUID,
            result.created_at
        );
    }

    async removeAuditLog(
        userId: UUID,
        announcementId?: UUID,
        commentId?: UUID
    ): Promise<void> {
        let qb = this.db.deleteFrom('audit_logs').where('user_id', '=', userId);

        if (announcementId)
            qb = qb.where('announcement_id', '=', announcementId);
        if (commentId) qb = qb.where('comment_id', '=', commentId);

        await qb.execute();
    }
}
