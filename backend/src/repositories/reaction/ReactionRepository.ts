import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Reaction } from '../../models/Reaction';

export class ReactionRepository {
    constructor(private db: Kysely<Database>) { }

    async getReactions(
        announcementId: UUID
    ): Promise<Reaction[]> {
        const result = await this.db
            .selectFrom('reactions')
            .selectAll()
            .where('item_id', '=', announcementId)
            .orderBy('sent_at', 'desc')
            .execute();

        return result.map(
            r =>
                new Reaction(
                    r.id as UUID,
                    r.item_id as UUID,
                    r.user_id as UUID,
                    r.type,
                    r.sent_at
                )
        );
    }


    async addReaction(
        userId: UUID,
        type: 'like' | 'dislike',
        itemId: UUID
    ): Promise<Reaction> {
        const result = await this.db
            .insertInto('reactions')
            .values({
                id: crypto.randomUUID(),
                user_id: userId,
                item_id: itemId,
                type: type
            })
            .returning(['id', 'sent_at'])
            .executeTakeFirstOrThrow();

        return new Reaction(
            result.id as UUID,
            userId,
            itemId,
            type,
            result.sent_at
        );
    }

    async removeReaction(
        userId: UUID,
        itemId: UUID
    ): Promise<void> {
        await this.db
            .deleteFrom('reactions')
            .where('user_id', '=', userId)
            .where('item_id', '=', itemId)
            .execute();
    }

}
