import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';
import { sql } from 'kysely';

import { Database } from '../../database/connection';
import { Announcement } from '../../models/Announcement';

/**
 * Repository responsible for CRUD operations on the `announcements` table.
 */
export class AnnouncementRepository {
    constructor(private db: Kysely<Database>) {}

    /**
     * Finds a single announcement by its ID.
     * @param id - UUID of the announcement to retrieve
     * @returns An Announcement instance if found; otherwise, null
     */
    async getById(id: UUID): Promise<Announcement | null> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .where('id', '=', id)
            .execute();

        if (result.length <= 0) {
            return null;
        }

        const { user_id, title, content, category, type, created_at } =
            result[0];

        return new Announcement(
            id,
            user_id as UUID,
            title,
            content,
            category,
            type,
            created_at
        );
    }

    /**
     * Returns all announcements in the system without filtering.
     * Used mostly for testing or internal/admin use.
     */
    async getAllAnnouncements(): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .execute();

        return result.map(
            r =>
                new Announcement(
                    r.id as UUID,
                    r.user_id as UUID,
                    r.title,
                    r.content,
                    r.category,
                    r.type,
                    r.created_at
                )
        );
    }

    /**
     * Returns all announcements created by a specific user.
     * @param userId - UUID of the user
     */
    async getAnnouncementsByUserId(userId: UUID): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .where('user_id', '=', userId)
            .execute();

        return result.map(
            r =>
                new Announcement(
                    r.id as UUID,
                    r.user_id as UUID,
                    r.title,
                    r.content,
                    r.category,
                    r.type,
                    r.created_at
                )
        );
    }

    /**
     * Inserts a new announcement into the database.
     * Generates a new UUID and sets creation timestamp.
     */
    async addAnnouncement(
        userId: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ): Promise<Announcement> {
        const result = await this.db
            .insertInto('announcements')
            .values({
                id: randomUUID(),
                user_id: userId,
                title: title,
                content: content,
                category: category,
                type: type
            })
            .returning(['id', 'created_at'])
            .executeTakeFirstOrThrow();

        return new Announcement(
            result.id as UUID,
            userId,
            title,
            content,
            category,
            type,
            result.created_at
        );
    }

    /**
     * Updates an existing announcement.
     * @returns The updated Announcement, or null if not found.
     */
    async updateAnnouncement(
        id: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ): Promise<Announcement | null> {
        const result = await this.db
            .updateTable('announcements')
            .set({ title, content, category, type })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirstOrThrow();

        if (!result) {
            return null;
        }

        return new Announcement(
            result.id as UUID,
            result.user_id as UUID,
            result.title,
            result.content,
            result.category,
            result.type,
            result.created_at
        );
    }

    /**
     * Deletes an announcement by its ID.
     */
    async deleteAnnouncement(id: UUID): Promise<void> {
        await this.db
            .deleteFrom('announcements')
            .where('id', '=', id)
            .execute();
    }

    /**
     * Returns announcements filtered by optional category and/or type.
     */
    async getFiltered(
        category?: string,
        type?: string
    ): Promise<Announcement[]> {
        let qb = this.db.selectFrom('announcements').selectAll();
        if (category) qb = qb.where('category', '=', category);
        if (type) qb = qb.where('type', '=', type);

        const result = await qb.execute();
        return result.map(
            r =>
                new Announcement(
                    r.id as UUID,
                    r.user_id as UUID,
                    r.title,
                    r.content,
                    r.category,
                    r.type,
                    r.created_at
                )
        );
    }

    /**
     * Returns all announcements joined with author email.
     * Used for admin views.
     */
    async getAllWithAuthors() {
        const rows = await this.db
            .selectFrom('announcements as a')
            .innerJoin('users as u', 'a.user_id', 'u.id')
            .select([
                'a.id',
                'a.user_id',
                'a.title',
                'a.content',
                'a.category',
                'a.type',
                'a.created_at',
                'u.email'
            ])
            .execute();

        return rows.map(r => ({
            id: r.id,
            title: r.title,
            content: r.content,
            category: r.category,
            type: r.type,
            createdAt: r.created_at,
            userId: r.user_id,
            authorEmail: r.email
        }));
    }

    /**
     * Returns a list of distinct categories currently used.
     */
    async getDistinctCategories(): Promise<string[]> {
        const rows = await this.db
            .selectFrom('announcements')
            .select(sql`distinct category`.as('category'))
            .execute();

        return rows.map(r => r.category as string);
    }
}
