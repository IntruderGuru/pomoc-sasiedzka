import { Kysely, sql } from 'kysely';
import { randomUUID } from 'crypto';
import { Database } from '../../database/connection';

/**
 * Repository class responsible for managing reactions in the database.
 * Supports likes/dislikes for both announcements and comments.
 */
export class ReactionRepository {
    constructor(private db: Kysely<Database>) { }

    /**
     * Retrieves all reactions for a specific announcement.
     *
     * @param id - ID of the announcement
     * @returns Array of reaction rows
     */
    getByAnnouncement(id: string) {
        return this.db
            .selectFrom('reactions')
            .selectAll()
            .where('announcement_id', '=', id)
            .execute();
    }

    /**
     * Retrieves all reactions for a specific comment.
     *
     * @param id - ID of the comment
     * @returns Array of reaction rows
     */
    getByComment(id: string) {
        return this.db
            .selectFrom('reactions')
            .selectAll()
            .where('comment_id', '=', id)
            .execute();
    }

    /**
     * Inserts a new reaction (like/dislike) into the database.
     * Automatically determines whether the target is a comment or announcement.
     *
     * @param userId - ID of the user reacting
     * @param type - Type of reaction: 'like' or 'dislike'
     * @param target - Object specifying either an announcementId or commentId
     * @returns The inserted reaction row
     */
    addReaction(
        userId: string,
        type: 'like' | 'dislike',
        target: { announcementId?: string; commentId?: string }
    ) {
        const row = {
            id: randomUUID(),
            user_id: userId,
            announcement_id: target.announcementId ?? null,
            comment_id: target.commentId ?? null,
            type,
            created_at: new Date()
        };

        return this.db
            .insertInto('reactions')
            .values(row)
            .execute()
            .then(() => row);
    }

    /**
     * Removes a user's reaction from either a comment or announcement.
     *
     * @param userId - ID of the user whose reaction should be removed
     * @param target - Object specifying the reaction target
     * @returns Promise resolving when the reaction is deleted
     */
    removeReaction(
        userId: string,
        target: { announcementId?: string; commentId?: string }
    ) {
        let qb = this.db
            .deleteFrom('reactions')
            .where('user_id', '=', userId);

        qb = target.announcementId
            ? qb.where('announcement_id', '=', target.announcementId)
            : qb.where('comment_id', '=', target.commentId!);

        return qb.execute();
    }

    /**
     * Retrieves minimal ownership info (user_id) for a given reaction.
     * Used to verify that a user is authorized to delete it.
     *
     * @param reactionId - ID of the reaction
     * @returns Reaction row with ID and user_id
     */
    async getOwnerInfo(reactionId: string) {
        return this.db
            .selectFrom('reactions')
            .select(['id', 'user_id'])
            .where('id', '=', reactionId)
            .executeTakeFirst();
    }
}
