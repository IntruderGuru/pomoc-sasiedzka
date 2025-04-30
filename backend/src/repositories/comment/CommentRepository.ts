import { Kysely } from 'kysely';
import { randomUUID } from 'crypto';
import { Database } from '../../database/connection';

/**
 * Repository class responsible for performing CRUD operations
 * on the `comments` table in the database.
 * 
 * Handles data access logic related to user comments under announcements.
 */
export class CommentRepository {
    constructor(private db: Kysely<Database>) { }

    /**
     * Retrieves all comments for a specific announcement,
     * sorted in ascending order of creation date.
     * 
     * @param announcementId - The ID of the announcement
     * @returns Array of matching comment rows
     */
    getByAnnouncement(announcementId: string) {
        return this.db
            .selectFrom('comments')
            .selectAll()
            .where('announcement_id', '=', announcementId)
            .orderBy('created_at', 'asc')
            .execute();
    }

    /**
     * Inserts a new comment into the database.
     * Generates a UUID and sets the creation timestamp.
     * 
     * @param userId - The ID of the user adding the comment
     * @param announcementId - The announcement being commented on
     * @param content - Text content of the comment
     * @returns The inserted comment row
     */
    addComment(userId: string, announcementId: string, content: string) {
        const row = {
            id: randomUUID(),
            user_id: userId,
            announcement_id: announcementId,
            content,
            created_at: new Date()
        };

        return this.db
            .insertInto('comments')
            .values(row)
            .execute()
            .then(() => row);
    }

    /**
     * Deletes a comment by its ID.
     * 
     * @param commentId - The ID of the comment to delete
     * @returns A promise that resolves when the comment is deleted
     */
    delete(commentId: string) {
        return this.db
            .deleteFrom('comments')
            .where('id', '=', commentId)
            .execute();
    }

    /**
     * Retrieves a single comment by its ID.
     * Used to check ownership before deletion.
     * 
     * @param commentId - The ID of the comment to fetch
     * @returns The comment row if found, otherwise null
     */
    getById(commentId: string) {
        return this.db
            .selectFrom('comments')
            .selectAll()
            .where('id', '=', commentId)
            .executeTakeFirst();
    }
}
