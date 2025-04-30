import { ReactionRepository } from '../repositories/reaction/ReactionRepository';

/**
 * Service layer responsible for handling business logic related to reactions (like/dislike).
 * Validates reaction types and delegates persistence to the repository.
 */
export class ReactionService {
    constructor(private repo: ReactionRepository) { }

    /**
     * Validates that the reaction type is either 'like' or 'dislike'.
     * 
     * @param type - Reaction type string
     * @throws { status: 400, message: 'Invalid type' } if invalid
     */
    private validateType(type: string) {
        if (!['like', 'dislike'].includes(type)) {
            throw { status: 400, message: 'Invalid type' };
        }
    }

    /**
     * Adds a like/dislike reaction to an announcement after validation.
     * 
     * @param userId - ID of the user reacting
     * @param announcementId - ID of the announcement being reacted to
     * @param type - Reaction type ('like' or 'dislike')
     * @returns The inserted reaction row
     */
    addToAnnouncement(userId: string, announcementId: string, type: string) {
        this.validateType(type);
        return this.repo.addReaction(userId, type as any, { announcementId });
    }

    /**
     * Removes a user's reaction from a specific announcement.
     * 
     * @param userId - ID of the user
     * @param announcementId - ID of the announcement
     * @returns Promise resolving when the reaction is removed
     */
    removeFromAnnouncement(userId: string, announcementId: string) {
        return this.repo.removeReaction(userId, { announcementId });
    }

    /**
     * Adds a like/dislike reaction to a comment after validation.
     * 
     * @param userId - ID of the user reacting
     * @param commentId - ID of the comment
     * @param type - Reaction type ('like' or 'dislike')
     * @returns The inserted reaction row
     */
    addToComment(userId: string, commentId: string, type: string) {
        this.validateType(type);
        return this.repo.addReaction(userId, type as any, { commentId });
    }

    /**
     * Removes a user's reaction from a specific comment.
     * 
     * @param userId - ID of the user
     * @param commentId - ID of the comment
     * @returns Promise resolving when the reaction is removed
     */
    removeFromComment(userId: string, commentId: string) {
        return this.repo.removeReaction(userId, { commentId });
    }
}
