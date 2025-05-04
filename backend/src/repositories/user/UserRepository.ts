import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { User } from '../../models/User';

/**
 * Repository class responsible for direct interaction with the `users` table.
 * Encapsulates all SQL-related logic for creating and retrieving user data.
 * Returns domain objects (User instances) rather than raw query results.
 */
export class UserRepository {
    constructor(private db: Kysely<Database>) {}

    /**
     * Adds a new user to the database.
     * Generates a UUID server-side and accepts a hashed password.
     *
     * @param email - The user’s email address
     * @param password - Hashed password (never raw text)
     * @param role - The role assigned to the user ('user' or 'admin')
     * @returns A User domain model instance representing the newly created user
     */
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

    /**
     * Fetches a user by their email address.
     * This is used during login to retrieve the hashed password and verify credentials.
     *
     * @param email - The email to search for
     * @returns A User instance if found, or `null` if no user exists with that email
     */
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

        return new User(id as UUID, email, password, role);
    }
}
