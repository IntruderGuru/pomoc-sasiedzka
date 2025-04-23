import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';
import { UUID } from 'crypto';

export class AnnouncementService {
    constructor(private repo: AnnouncementRepository) {}

    create(
        userId: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ) {
        return this.repo.addAnnoucement(userId, title, content, category, type);
    }

    getAll() {
        return this.repo.getAllAnnoucements();
    }

    getById(id: UUID) {
        return this.repo.getAnnoucementsByUserId(id);
    }

    update(
        id: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ) {
        return this.repo.updateAnnoucement(id, title, content, category, type);
    }

    delete(id: UUID) {
        return this.repo.deleteAnnoucement(id);
    }
}
