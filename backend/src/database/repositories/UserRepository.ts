import { randomUUID } from 'crypto';
import { Database } from '../connection';
import { Kysely } from 'kysely';
import { User } from '../../models/User';

export class UserRepository {
    constructor(private db: Kysely<Database>) { }

    async addUser(email: string, password: string): Promise<User> {
        const result = await this.db
            .insertInto('users')
            .values({ id: randomUUID(), email: email, password: password })
            .returningAll()
            .executeTakeFirst();

        return result!;
    }

    async getUserByEmail(email: string): Promise<User> {
        const result = await this.db
            .selectFrom('users')
            .selectAll()
            .where('email', '=', email)
            .executeTakeFirst();

        return result!;
    }
}
