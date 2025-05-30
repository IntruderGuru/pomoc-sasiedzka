import { UUID } from 'crypto';

/**
 * Domain model representing an application user.
 * Encapsulates the core properties and accessors related to authentication and authorization.
 *
 * This class is a plain domain object — not directly coupled to any framework or persistence logic.
 * It is used across repositories, services, and sometimes controllers for typed business logic.
 */
export class User {
    constructor(
        /** Unique identifier of the user (UUID v4) */
        readonly id: UUID,

        /** Email address used for authentication and communication */
        private email: string,

        /** Hashed password (never stored or returned in raw form) */
        private password: string,

        /** Role-based access control flag — determines user privileges */
        private role: 'user' | 'admin',

        /** Username for display purposes */
        private username: string,
    ) { }

    // Getter for the email address (used in token payloads, profile views, etc.)
    getEmail(): string {
        return this.email;
    }

    // Getter for the hashed password (used for credential comparison during login)
    getPassword(): string {
        return this.password;
    }

    // Getter for the role (used in middleware and admin-level checks)
    getRole(): 'user' | 'admin' {
        return this.role;
    }

    getUsername(): string | undefined {
        return this.username;
    }
}
