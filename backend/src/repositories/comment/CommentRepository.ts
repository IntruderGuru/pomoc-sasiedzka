import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Comment } from '../../models/Comment';

export class CommentRepository {
    constructor(private db: Kysely<Database>) {}

    async getComments(announcementId: UUID): Promise<Comment[]> {
        const result = await this.db
            .selectFrom('comments')
            .selectAll()
            .where('announcement_id', '=', announcementId)
            .orderBy('sent_at', 'desc')
            .execute();

        return result.map(
            r =>
                new Comment(
                    r.id,
                    r.sender_id as UUID,
                    r.announcement_id as UUID,
                    r.content,
                    r.sent_at
                )
        );
    }

    async addComment(
        announcementId: UUID,
        senderId: UUID,
        content: string
    ): Promise<Comment> {
        const result = await this.db
            .insertInto('comments')
            .values({
                announcement_id: announcementId,
                sender_id: senderId,
                content: content
            })
            .returning(['id', 'sent_at'])
            .executeTakeFirstOrThrow();

        return new Comment(
            result.id,
            announcementId,
            senderId,
            content,
            result.sent_at
        );
    }

    async deleteComment(id: number): Promise<void> {
        await this.db.deleteFrom('comments').where('id', '=', id);
    }
}
