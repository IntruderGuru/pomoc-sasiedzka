import { Kysely } from 'kysely';
import { Database } from '../connection';
import { Announcement } from '../../models/Announcement';
import { randomUUID } from 'crypto';

export class AnnouncementRepository {
    constructor(private db: Kysely<Database>) {}

    async getAllAnnoucements(): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .execute();

        return result;
    }

    async getAnnoucementsByUserId(userId: string): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .where('userId', '=', userId)
            .execute();

        return result;
    }

    async addAnnoucement(
        userId: string,
        title: string,
        content: string
    ): Promise<Announcement> {
        const result = await this.db
            .insertInto('announcements')
            .values({
                id: randomUUID(),
                userId: userId,
                title: title,
                content: content,
                createdAt: new Date()
            })
            .returningAll()
            .executeTakeFirst();

        return result!;
    }

    async updateAnnoucement(
        id: string,
        title: string,
        content: string
    ): Promise<Announcement> {
        const result = await this.db
            .updateTable('announcements')
            .set({ title: title, content: content })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        return result!;
    }

    async deleteAnnoucement(id: string): Promise<Announcement> {
        const result = await this.db
            .deleteFrom('announcements')
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        return result!;
    }
}
