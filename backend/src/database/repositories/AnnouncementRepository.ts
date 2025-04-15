import { Kysely } from 'kysely';
import { Database } from '../connection';
import { Announcement } from '../../models/Announcement';
import { randomUUID } from 'crypto';

export class AnnouncementRepository {
    constructor(private db: Kysely<Database>) { }

    async create(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
        const result = await this.db
            .insertInto('announcement')
            .values({
                id: randomUUID(),
                ...data,
                createdAt: new Date()
            })
            .returningAll()
            .executeTakeFirst();

        return result!;
    }

    async getAll(): Promise<Announcement[]> {
        return await this.db.selectFrom('announcement').selectAll().execute();
    }

    async getById(id: string): Promise<Announcement | undefined> {
        return await this.db
            .selectFrom('announcement')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }

    async update(id: string, data: Partial<Announcement>): Promise<Announcement | null> {
        const result = await this.db
            .updateTable('announcement')
            .set(data)
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        return result ?? null;
    }

    async delete(id: string): Promise<void> {
        await this.db
            .deleteFrom('announcement')
            .where('id', '=', id)
            .execute();
    }
}
