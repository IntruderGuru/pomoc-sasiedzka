import { Kysely } from 'kysely';
import { Database } from '../connection';
import { Annoucement } from '../../models/Announcement';
import { randomUUID } from 'crypto';

export class AnnoucementRepository {
    constructor(private db: Kysely<Database>) {}

    async getAllAnnoucements(): Promise<Annoucement[]> {
        const result = await this.db
            .selectFrom('annoucement')
            .selectAll()
            .execute();

        return result;
    }

    async getAnnoucementsByUserId(userId: string): Promise<Annoucement[]> {
        const result = await this.db
            .selectFrom('annoucement')
            .selectAll()
            .where('userId', '=', userId)
            .execute();

        return result;
    }

    async addAnnoucement(
        userId: string,
        title: string,
        content: string
    ): Promise<Annoucement> {
        const result = await this.db
            .insertInto('annoucement')
            .values({
                id: randomUUID(),
                userId: userId,
                title: title,
                content: content,
                created_at: new Date().toDateString()
            })
            .returningAll()
            .executeTakeFirst();

        return result!;
    }

    async updateAnnoucement(
        id: string,
        title: string,
        content: string
    ): Promise<Annoucement> {
        const result = await this.db
            .updateTable('annoucement')
            .set({ title: title, content: content })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        return result!;
    }

    async deleteAnnoucement(id: string): Promise<Annoucement> {
        const result = await this.db
            .deleteFrom('annoucement')
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst();

        return result!;
    }
}
