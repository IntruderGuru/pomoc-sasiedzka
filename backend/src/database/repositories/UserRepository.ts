import { randomUUID, UUID } from 'crypto';
import { Database } from '../connection';
import { Kysely } from 'kysely';
import { User } from '../../models/User';

export class UserRepository {
    constructor(private db: Kysely<Database>) {}

    async addUser(
        email: string,
        password: string,
        role: 'user' | 'admin'
    ): Promise<User> {
        const newUser = new User(randomUUID(), email, password, role);

        await this.db
            .insertInto('users')
            .values({
                id: newUser.id,
                email: newUser.getEmail(),
                password: newUser.getPassword(),
                role: newUser.getRole()
            })
            .execute();

        return newUser;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const result = await this.db
            .selectFrom('users')
            .selectAll()
            .where('email', '=', email)
            .execute();

        if (result.length <= 0) {
            return null;
        }

        const { id, password, role } = result[0];
        const user = new User(id as UUID, email, password, role);

        return user;
    }
}
