import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Reaction } from '../../models/Reaction';

export class ReactionRepository {
    constructor(private db: Kysely<Database>) {}

    async getReactions(
        announcementId?: UUID,
        commentId?: UUID
    ): Promise<Reaction[]> {
        let qb = await this.db.selectFrom('reactions').selectAll();

        if (announcementId)
            qb = qb.where('announcement_id', '=', announcementId);
        if (commentId) qb = qb.where('comment_id', '=', commentId);

        const result = await qb.execute();

        return result.map(
            r =>
                new Reaction(
                    r.id as UUID,
                    r.user_id as UUID,
                    r.announcement_id as UUID,
                    r.comment_id as UUID,
                    r.type
                )
        );
    }

    async addReaction(
        userId: UUID,
        type: 'like' | 'dislike',
        announcementId?: UUID,
        commentId?: UUID
    ): Promise<Reaction> {
        const result = await this.db
            .insertInto('reactions')
            .values({
                id: crypto.randomUUID(),
                user_id: userId,
                announcement_id: announcementId,
                comment_id: commentId,
                type: type
            })
            .returning(['id'])
            .executeTakeFirstOrThrow();

        return new Reaction(
            result.id as UUID,
            userId as UUID,
            announcementId as UUID,
            commentId as UUID,
            type
        );
    }

    async removeReaction(
        userId: UUID,
        announcementId?: UUID,
        commentId?: UUID
    ): Promise<void> {
        let qb = this.db.deleteFrom('reactions').where('user_id', '=', userId);

        if (announcementId)
            qb = qb.where('announcement_id', '=', announcementId);
        if (commentId) qb = qb.where('comment_id', '=', commentId);

        await qb.execute();
    }
}
