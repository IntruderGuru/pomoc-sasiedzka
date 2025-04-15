import { Announcement } from '../models/Announcement';
import { AnnouncementRepository } from '../database/repositories/AnnouncementRepository';

export class AnnouncementService {
    constructor(private repo: AnnouncementRepository) { }

    create(data: Omit<Announcement, 'id' | 'createdAt'>) {
        return this.repo.create(data);
    }

    getAll() {
        return this.repo.getAll();
    }

    getById(id: string) {
        return this.repo.getById(id);
    }

    update(id: string, userId: string, role: string, updatedData: Partial<Announcement>) {
        return this.repo.getById(id).then(announcement => {
            if (!announcement) throw new Error('Not found');
            if (announcement.userId !== userId && role !== 'admin') {
                throw new Error('Forbidden');
            }
            return this.repo.update(id, updatedData);
        });
    }

    delete(id: string, userId: string, role: string) {
        return this.repo.getById(id).then(announcement => {
            if (!announcement) throw new Error('Not found');
            if (announcement.userId !== userId && role !== 'admin') {
                throw new Error('Forbidden');
            }
            return this.repo.delete(id);
        });
    }
}
