import { Kysely, sql, ExpressionBuilder } from 'kysely';
import { randomUUID } from 'crypto';
import { Database } from '../../database/connection';

/**
 * Repository class responsible for all operations related to private messages.
 * Handles message creation, conversation list retrieval, and fetching full threads.
 */
export class MessageRepository {
    constructor(private db: Kysely<Database>) { }

    /**
     * Inserts a new private message into the `messages` table.
     * Generates a UUID and sets the current timestamp.
     *
     * @param sender - ID of the user sending the message
     * @param receiver - ID of the recipient
     * @param content - Text content of the message
     * @returns The inserted message row
     */
    addMessage(sender: string, receiver: string, content: string) {
        const row = {
            id: randomUUID(),
            sender_id: sender,
            receiver_id: receiver,
            content,
            sent_at: new Date()
        };

        return this.db
            .insertInto('messages')
            .values(row)
            .execute()
            .then(() => row);
    }

    /**
     * Returns the most recent message per distinct conversation for a given user.
     * Uses PostgreSQL-specific `DISTINCT ON` to group messages by conversation.
     *
     * @param userId - ID of the user for whom to retrieve conversations
     * @returns An array of the latest message for each unique conversation
     */
    async findConversations(userId: string) {
        return this.db
            .selectFrom('messages')
            .select([
                // Select the most recent message per conversation pair
                sql`DISTINCT ON (least(sender_id, receiver_id), greatest(sender_id, receiver_id)) id`.as('id'),
                'sender_id',
                'receiver_id',
                'content',
                'sent_at'
            ])
            .where((eb) =>
                eb.or([
                    eb('sender_id', '=', userId),
                    eb('receiver_id', '=', userId)
                ])
            )
            .orderBy(sql`least(sender_id, receiver_id)`) // Ensures proper grouping
            .orderBy('sent_at', 'desc') // Latest message in each group
            .execute();
    }

    /**
     * Retrieves the full message thread between two users in chronological order.
     * Includes both directions of messaging (A→B and B→A).
     *
     * @param a - First user's ID
     * @param b - Second user's ID
     * @returns Array of all messages exchanged between the two users
     */
    findThread(a: string, b: string) {
        return this.db
            .selectFrom('messages')
            .selectAll()
            .where((eb: ExpressionBuilder<Database, 'messages'>) =>
                eb.or([
                    eb.and([
                        eb('sender_id', '=', a),
                        eb('receiver_id', '=', b)
                    ]),
                    eb.and([
                        eb('sender_id', '=', b),
                        eb('receiver_id', '=', a)
                    ])
                ])
            )
            .orderBy('sent_at', 'asc') // Chronological order
            .execute();
    }
}
