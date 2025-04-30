import { UUID } from 'crypto';

import { AnnouncementRepository } from '../repositories/announcement/AnnouncementRepository';

/**
 * Service layer responsible for business logic related to announcements.
 * It mediates between the controller layer (HTTP) and the repository (database access).
 *
 * This class contains validation, fallback logic, and coordinates complex operations.
 */
export class AnnouncementService {
    constructor(private repo: AnnouncementRepository) {}

    /**
     * Creates a new announcement after validating required fields.
     *
     * @param userId - UUID of the user creating the announcement
     * @param title - Announcement title (required)
     * @param content - Main body of the announcement (required)
     * @param category - Category label (required)
     * @param type - Type label (required)
     * @throws Error if any field is missing
     * @returns The created Announcement instance
     */
    async create(
        userId: string,
        title: string,
        content: string,
        category: string,
        type: string
    ) {
        if (!title || !content || !category || !type) {
            throw new Error('All fields are required');
        }

        return this.repo.addAnnouncement(
            userId as UUID,
            title,
            content,
            category,
            type
        );
    }

    /**
     * Retrieves all announcements, optionally filtered by category and/or type.
     *
     * @param filters - Optional category and type filters
     * @returns List of matching Announcement instances
     */
    async getAll(filters: { category?: string; type?: string }) {
        return this.repo.getFiltered(filters.category, filters.type);
    }

    /**
     * Retrieves all announcements created by a specific user.
     *
     * @param userId - UUID of the user
     * @returns List of that user's announcements
     */
    async getByUser(userId: string) {
        return this.repo.getAnnouncementsByUserId(userId as UUID);
    }

    /**
     * Retrieves all announcements along with author email metadata.
     * Intended for administrative views only.
     */
    async getAllForAdmin() {
        return this.repo.getAllWithAuthors();
    }

    /**
     * Retrieves all unique announcement categories.
     * Used to populate dropdown filters on the frontend.
     */
    async getCategories() {
        return this.repo.getDistinctCategories();
    }

    /**
     * Updates an existing announcement.
     *
     * @param id - ID of the announcement to update
     * @param title - New title
     * @param content - New content
     * @param category - New category
     * @param type - New type
     * @throws Error if no announcement was found for the given ID
     * @returns The updated Announcement
     */
    async update(
        id: UUID,
        title: string,
        content: string,
        category: string,
        type: string
    ) {
        const updated = await this.repo.updateAnnouncement(
            id,
            title,
            content,
            category,
            type
        );
        if (!updated) {
            throw new Error('Not found');
        }
        return updated;
    }

    async findById(id: UUID) {
        const announcement = await this.repo.getById(id);
        if (!announcement) {
            throw new Error('Not found');
        }
        return announcement;
    }

    /**
     * Deletes an announcement by ID.
     *
     * @param id - UUID of the announcement
     * @returns Promise that resolves when deletion is complete
     */
    delete(id: UUID) {
        return this.repo.deleteAnnouncement(id);
    }
}
