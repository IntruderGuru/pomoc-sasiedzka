import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Reaction } from '../../models/Reaction';

export class ReactionRepository {
    constructor(private db: Kysely<Database>) { }

    async getReactionsByAnnouncementId(
        announcementId: UUID
    ): Promise<Reaction[]> {
        const result = await this.db
            .selectFrom('reactions')
            .selectAll()
            .where('announcement_id', '=', announcementId)
            .orderBy('sent_at', 'desc')
            .execute();

        return result.map(
            r =>
                new Reaction(
                    r.id,
                    r.announcement_id as UUID,
                    r.user_id as UUID,
                    r.comment_id as UUID, // ???
                    r.type,
                    r.sent_at
                )
        );
    }

    async getReactionsByCommentId(commentId: UUID): Promise<Reaction[]> {
        const result = await this.db
            .selectFrom('reactions')
            .selectAll()
            .where('comment_id', '=', commentId)
            .orderBy('sent_at', 'desc')
            .execute();

        return result.map(
            r =>
                new Reaction(
                    r.id,
                    r.announcement_id as UUID,
                    r.user_id as UUID,
                    r.comment_id as UUID,
                    r.type,
                    r.sent_at
                )
        );
    }

    async addReaction(
        announcementId: UUID,
        userId: UUID,
        commentId: UUID,
        type: string
    ): Promise<Reaction> {
        const result = await this.db
            .insertInto('reactions')
            .values({
                announcement_id: announcementId,
                user_id: userId,
                comment_id: commentId,
                type: type
            })
            .returning(['id', 'sent_at'])
            .executeTakeFirstOrThrow();

        return new Reaction(
            result.id,
            announcementId,
            userId,
            commentId,
            type,
            result.sent_at
        );
    }
}
