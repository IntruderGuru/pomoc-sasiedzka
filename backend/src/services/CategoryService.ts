import { UUID } from 'crypto';
import { CategoryRepository } from '../repositories/category/CategoryRepository';
import { AuditLogRepository } from '../repositories/audit/AuditLogRepository';

export class CategoryService {
    constructor(
        private repo: CategoryRepository,
        private audit: AuditLogRepository
    ) { }

    getAll() {
        return this.repo.getAllCategories();
    }

    async create(adminId: UUID, name: string) {
        if (!name?.trim()) throw new Error('Name required');
        const cat = await this.repo.addCategory(name.trim());
        // await this.audit.add(adminId, 'create', '', cat.id, { name });
        return cat;
    }

    async update(adminId: UUID, id: UUID, name: string) {
        if (!name?.trim()) throw new Error('Name required');
        const cat = await this.repo.updateCategory(id, name.trim());
        if (!cat) throw new Error('Not found');
        // await this.audit.add(adminId, 'update', 'category', id, { name });
        return cat;
    }

    async delete(adminId: UUID, id: UUID) {
        await this.repo.deleteCategory(id);
        // await this.audit.add(adminId, 'delete', 'category', id, null);
    }
}
