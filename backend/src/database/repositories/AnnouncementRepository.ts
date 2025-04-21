import { Kysely } from 'kysely';
import { Database } from '../connection';
import { Announcement } from '../../models/Announcement';
import { randomUUID, UUID } from 'crypto';

export class AnnouncementRepository {
    constructor(private db: Kysely<Database>) {}

    async getAllAnnoucements(): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .execute();

        const announcements: Announcement[] = [];
        result.forEach(r => {
            const announcement = new Announcement(
                r.id as UUID,
                r.userId as UUID,
                r.title,
                r.content,
                r.category,
                r.type,
                r.createdAt
            );

            announcements.push(announcement);
        });

        return announcements;
    }

    async getAnnoucementsByUserId(userId: UUID): Promise<Announcement[]> {
        const result = await this.db
            .selectFrom('announcements')
            .selectAll()
            .where('userId', '=', userId)
            .execute();

        const announcements: Announcement[] = [];
        result.forEach(r => {
            const announcement = new Announcement(
                r.id as UUID,
                r.userId as UUID,
                r.title,
                r.content,
                r.category,
                r.type,
                r.createdAt
            );

            announcements.push(announcement);
        });

        return announcements;
    }

    async addAnnoucement(
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

        console.log(newAnnouncement);
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

    async updateAnnoucement(
        id: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ): Promise<void> {
        await this.db
            .updateTable('announcements')
            .set({
                title: title,
                content: content,
                category: category,
                type: type
            })
            .where('id', '=', id)
            .execute();
    }

    async deleteAnnoucement(id: UUID): Promise<void> {
        await this.db
            .deleteFrom('announcements')
            .where('id', '=', id)
            .execute();
    }
}
