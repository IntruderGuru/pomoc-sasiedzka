import { MessageRepository } from '../repositories/message/MessageRepository';
import { UUID } from 'crypto'
/**
 * Service layer responsible for business logic related to private messaging.
 * Performs input validation and delegates database access to the repository.
 */
export class MessageService {
    constructor(private repo: MessageRepository) { }

    /**
     * Sends a private message from sender to receiver after validating input.
     * Rejects empty or whitespace-only messages.
     * 
     * @param sender - ID of the user sending the message
     * @param receiver - ID of the user receiving the message
     * @param content - Text content of the message
     * @returns The inserted message row
     * @throws { status: 400, message: 'Content cannot be empty' } if content is invalid
     */
    sendMessage(sender: string, receiver: string, content: string) {
        if (!content?.trim()) {
            throw { status: 400, message: 'Content cannot be empty' };
        }

        return this.repo.addMessage(sender as UUID, receiver as UUID, content);
    }

    /**
     * Retrieves the latest message per unique conversation for a given user.
     * Each result represents one chat with another user.
     * 
     * @param userId - ID of the user whose conversations to fetch
     * @returns Array of latest messages from each conversation
     */
    getConversations(userId: string) {
        return this.repo.getConversations(userId as UUID);
    }

    /**
     * Retrieves the full chronological message thread between two users.
     * 
     * @param a - First user ID
     * @param b - Second user ID
     * @returns Array of all messages exchanged between the two users
     */
    getThread(a: string, b: string) {
        return this.repo.getThread(a as UUID, b as UUID);
    }
}
