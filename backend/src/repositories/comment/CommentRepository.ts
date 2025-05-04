import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Comment } from '../../models/Comment';

export class CommentRepository {
    constructor(private db: Kysely<Database>) { }

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
                    r.id as UUID,
                    r.user_id as UUID,
                    r.announcement_id as UUID,
                    r.content,
                    r.sent_at
                )
        );
    }

    async addComment(
        announcementId: UUID,
        userId: UUID,
        content: string
    ): Promise<Comment> {
        const result = await this.db
            .insertInto('comments')
            .values({
                id: crypto.randomUUID(),
                announcement_id: announcementId,
                user_id: userId,
                content: content
            })
            .returning(['id', 'sent_at'])
            .executeTakeFirstOrThrow();

        return new Comment(
            result.id as UUID,
            announcementId,
            userId,
            content,
            result.sent_at
        );
    }

    async deleteComment(id: UUID): Promise<void> {
        await this.db.deleteFrom('comments').where('id', '=', id);
    }

    async getCommentById(id: UUID): Promise<Comment | null> {
        const result = await this.db
            .selectFrom('comments')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (!result) {
            return null;
        }

        return new Comment(
            result.id as UUID,
            result.user_id as UUID,
            result.announcement_id as UUID,
            result.content,
            result.sent_at
        );
    }

}
