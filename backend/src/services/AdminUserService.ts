import { UUID } from 'crypto';
import { UserRepository } from '../repositories/user/UserRepository';
import { AuditLogRepository } from '../repositories/audit/AuditLogRepository';

export class AdminUserService {
    constructor(
        private users: UserRepository,
        private audit: AuditLogRepository
    ) { }

    getAllUsers() {
        return this.users.getAllUsers();   // metoda do dodania w repo
    }

    async updateRole(adminId: UUID, userId: UUID, role: 'user' | 'admin') {
        await this.users.updateUserRole(userId, role);
        // await this.audit.add(adminId, 'update-role', 'user', userId, { role });
    }

    async deactivateUser(adminId: UUID, userId: UUID) {
        await this.users.deactivateUser(userId);     // metoda do dodania
        // await this.audit.add(adminId, 'deactivate', 'user', userId, null);
    }
}
