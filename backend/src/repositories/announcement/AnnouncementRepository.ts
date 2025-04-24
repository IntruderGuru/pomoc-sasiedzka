import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';
import { sql } from 'kysely';

import { Database } from '../../database/connection';
import { Announcement } from '../../models/Announcement';

/**
 * Repository responsible for accessing and modifying announcement-related data.
 * This class interacts directly with the database and returns domain models (not raw DB rows).
 * 
 * By separating data access from business logic, we maintain clean architecture and testability.
 */
export class AnnouncementRepository {
    constructor(private db: Kysely<Database>) { }

    /**
     * Returns all announcements in the system without filtering.
     * Used mostly for testing or internal/admin use.
     */
    async getAllAnnouncements(): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .execute();

        return result.map(r => new Announcement(
            r.id as UUID,
            r.userId as UUID,
            r.title,
            r.content,
            r.category,
            r.type,
            r.createdAt
        ));
    }

    /**
     * Returns all announcements created by a specific user.
     * @param userId - the UUID of the user
     */
    async getAnnouncementsByUserId(userId: UUID): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .where('userId', '=', userId)
            .execute();

        return result.map(r => new Announcement(
            r.id as UUID,
            r.userId as UUID,
            r.title,
            r.content,
            r.category,
            r.type,
            r.createdAt
        ));
    }

    /**
     * Inserts a new announcement into the database.
     * Generates a new UUID and creation timestamp on insert.
     */
    async addAnnouncement(
        userId: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ): Promise<Announcement> {
        const newAnnouncement = new Announcement(
            randomUUID(),
            userId,
            title,
            content,
            category,
            type,
            new Date()
        );

        // Insert the record into the DB
        await this.db
            .insertInto('announcements')
            .values({
                id: newAnnouncement.id,
                userId: newAnnouncement.userId,
                title: newAnnouncement.getTitle(),
                content: newAnnouncement.getContent(),
                category: newAnnouncement.getCategory(),
                type: newAnnouncement.getType(),
                createdAt: newAnnouncement.createdAt
            })
            .execute();

        return newAnnouncement;
    }

    /**
     * Updates an existing announcement.
     * Returns the updated domain object if found; otherwise, returns null.
     */
    async updateAnnouncement(
        id: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ): Promise<Announcement | null> {
        const row = await this.db
            .updateTable('announcements')
            .set({
                title,
                content,
                category,
                type
            })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        if (!row) return null;

        return new Announcement(
            row.id as UUID,
            row.userId as UUID,
            row.title,
            row.content,
            row.category,
            row.type,
            row.createdAt
        );
    }

    /**
     * Deletes an announcement by ID.
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
    async getFiltered(category?: string, type?: string): Promise<Announcement[]> {
        let qb = this.db.selectFrom('announcements').selectAll();

        if (category) qb = qb.where('category', '=', category);
        if (type) qb = qb.where('type', '=', type);

        const result = await qb.execute();

        return result.map(r => new Announcement(
            r.id as UUID,
            r.userId as UUID,
            r.title,
            r.content,
            r.category,
            r.type,
            r.createdAt
        ));
    }

    /**
     * Returns all announcements joined with author data (email).
     * Used in admin views to associate posts with user accounts.
     */
    async getAllWithAuthors() {
        const rows = await this.db
            .selectFrom('announcements as a')
            .innerJoin('users as u', 'a.userId', 'u.id')
            .select([
                'a.id',
                'a.title',
                'a.content',
                'a.category',
                'a.type',
                'a.createdAt',
                'u.id as userId',
                'u.email as authorEmail'
            ])
            .execute();

        return rows.map(r => ({
            id: r.id,
            title: r.title,
            content: r.content,
            category: r.category,
            type: r.type,
            createdAt: r.createdAt,
            userId: r.userId,
            authorEmail: r.authorEmail
        }));
    }

    /**
     * Returns a list of all distinct categories currently used in announcements.
     * Useful for building dynamic filters on the frontend.
     */
    async getDistinctCategories(): Promise<string[]> {
        const rows = await this.db
            .selectFrom('announcements')
            .select(sql`distinct category`.as('category'))
            .execute();

        return rows.map(r => r.category as string);
    }
}
