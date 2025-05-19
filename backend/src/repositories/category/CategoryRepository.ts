import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';
import { Database } from '../../database/connection';
import { Category } from '../../models/Category';

export class CategoryRepository {

    constructor(private db: Kysely<Database>) { }

    async getAllCategories(): Promise<Category[]> {
        const result = await this.db
            .selectFrom('categories')
            .selectAll()
            .execute();

        return result.map(
            r => new Category(r.id as UUID, r.name, r.created_at)
        );
    }

    async addCategory(name: string): Promise<Category> {
        const result = await this.db
            .insertInto('categories')
            .values({ id: crypto.randomUUID(), name: name })
            .returning(['id', 'created_at'])
            .executeTakeFirstOrThrow();

        return new Category(result.id as UUID, name, result.created_at);
    }

    async updateCategory(id: UUID, name: string): Promise<Category | null> {
        const result = await this.db
            .updateTable('categories')
            .set({ name: name })
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirstOrThrow();

        if (!result) {
            return null;
        }

        return new Category(id, name, result.created_at);
    }
    async deleteCategory(id: UUID): Promise<void> {
        await this.db.deleteFrom('categories').where('id', '=', id).execute();
    }
}