import { CommentRepository } from '../repositories/comment/CommentRepository';

/**
 * Service layer responsible for business logic related to user comments.
 * Handles input validation, ownership checks, and delegates data access to the repository.
 */
export class CommentService {
    constructor(private repo: CommentRepository) { }

    /**
     * Validates and adds a new comment to an announcement.
     * Throws an error if the content is empty or blank.
     *
     * @param userId - ID of the user posting the comment
     * @param announcementId - ID of the announcement being commented on
     * @param content - Text content of the comment
     * @returns The newly inserted comment row
     */
    addComment(userId: string, announcementId: string, content: string) {
        if (!content?.trim()) {
            throw { status: 400, message: 'Content cannot be empty' };
        }

        return this.repo.addComment(userId, announcementId, content);
    }

    /**
     * Retrieves all comments for a given announcement.
     * 
     * @param announcementId - ID of the announcement
     * @returns Array of comment rows
     */
    getComments(announcementId: string) {
        return this.repo.getByAnnouncement(announcementId);
    }

    /**
     * Deletes a comment if the user is its owner or has admin privileges.
     * Performs existence and authorization checks before deletion.
     * 
     * @param commentId - ID of the comment to delete
     * @param userId - ID of the current user
     * @param role - Role of the current user ('user' or 'admin')
     */
    async deleteComment(
        commentId: string,
        userId: string,
        role: 'user' | 'admin'
    ) {
        const comment = await this.repo.getById(commentId);

        if (!comment) {
            throw { status: 404, message: 'Not found' };
        }

        const isOwner = comment.user_id === userId;
        const isAdmin = role === 'admin';

        if (!isOwner && !isAdmin) {
            throw { status: 403, message: 'Forbidden' };
        }

        await this.repo.delete(commentId);
    }
}
