import { Announcement } from '../models/Announcement';
import { AnnouncementRepository } from '../database/repositories/AnnouncementRepository';

export class AnnouncementService {
    constructor(private repo: AnnouncementRepository) { }

    create(data: Omit<Announcement, 'id' | 'createdAt'>) {
        return this.repo.addAnnoucement(data.userId, data.title, data.content);
    }

    getAll() {
        return this.repo.getAllAnnoucements();
    }

    getById(id: string) {
        return this.repo.getAnnoucementsByUserId(id);
    }

    update(id: string, userId: string, role: string, updatedData: Partial<Announcement>) {
        return this.repo.getAnnoucementsByUserId(id).then(announcement => {
            if (!announcement) throw new Error('Not found');
            // if (announcement.userId !== userId && role !== 'admin') {
            //     throw new Error('Forbidden');
            // }
            return //this.repo.updateAnnoucement(id, updatedData);
        });
    }

    delete(id: string, userId: string, role: string) {
        return this.repo.getAnnoucementsByUserId(id).then(announcement => {
            if (!announcement) throw new Error('Not found');
            // if (announcement.userId !== userId && role !== 'admin') {
            //     throw new Error('Forbidden');
            // }
            return this.repo.deleteAnnoucement(id);
        });
    }
}
