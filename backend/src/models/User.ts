import { UUID } from 'crypto';

export class User {
    constructor(
        readonly id: UUID,
        private email: string,
        private password: string,
        private role: 'user' | 'admin'
    ) {}

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getRole(): 'user' | 'admin' {
        return this.role;
    }
}
