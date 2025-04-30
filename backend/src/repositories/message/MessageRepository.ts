import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Message } from '../../models/Message';

export class MessageRepository {
    constructor(private db: Kysely<Database>) {}

    async getConversation(
        senderId: UUID,
        receiverId: UUID
    ): Promise<Message[]> {
        const result = await this.db
            .selectFrom('messages')
            .selectAll()
            .where(eb =>
                eb('sender_id', '=', senderId).and(
                    'receiver_id',
                    '=',
                    receiverId
                )
            )
            .orderBy('sent_at', 'desc')
            .execute();

        return result.map(
            r =>
                new Message(
                    r.id,
                    r.sender_id as UUID,
                    r.receiver_id as UUID,
                    r.content,
                    r.sent_at
                )
        );
    }

    async addMessage(
        senderId: UUID,
        receiverId: UUID,
        content: string
    ): Promise<Message> {
        const result = await this.db
            .insertInto('messages')
            .values({
                sender_id: senderId,
                receiver_id: receiverId,
                content: content,
                sent_at: new Date()
            })
            .returning(['id', 'sent_at'])
            .executeTakeFirstOrThrow();

        return new Message(
            result.id,
            senderId,
            receiverId,
            content,
            result.sent_at
        );
    }
}
