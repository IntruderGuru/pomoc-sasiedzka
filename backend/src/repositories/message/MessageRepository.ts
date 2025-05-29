import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Message } from '../../models/Message';

export class MessageRepository {
    constructor(private db: Kysely<Database>) { }

    async getThread(
        userId: UUID,
        receiverId: UUID
    ): Promise<Message[]> {

        const result = await this.db
            .selectFrom('messages')
            .selectAll()
            .where(eb =>
                eb.or([
                    eb('user_id', '=', userId).and(
                        'receiver_id',
                        '=',
                        receiverId
                    ),
                    eb('user_id', '=', receiverId).and(
                        'receiver_id',
                        '=',
                        userId
                    )
                ])
            )
            .orderBy('sent_at', 'desc')
            .execute();
        console.log(result);
        return result.map(
            r =>
                new Message(
                    r.id as UUID,
                    r.user_id as UUID,
                    r.receiver_id as UUID,
                    r.content,
                    r.sent_at
                )
        );
    }

    async getConversations(userId: UUID): Promise<Message[]> {
        const result = await this.db
            .selectFrom('messages')
            .selectAll()
            .where(eb =>
                eb.or([
                    eb('user_id', '=', userId),
                    eb('receiver_id', '=', userId)
                ])
            )
            .orderBy('sent_at', 'desc')
            .execute();

        const seen = new Set<string>();
        const conversations: Message[] = [];

        for (const r of result) {
            const partnerId = r.user_id === userId ? r.receiver_id : r.user_id;
            if (!seen.has(partnerId)) {
                seen.add(partnerId);
                conversations.push(
                    new Message(
                        r.id as UUID,
                        r.user_id as UUID,
                        r.receiver_id as UUID,
                        r.content,
                        r.sent_at
                    )
                );
            }
        }

        return conversations;
    }


    // async getConversations(userId: UUID): Promise<Message[]> {
    //     const result = await this.db
    //         .selectFrom('messages')
    //         .selectAll()
    //         .where('user_id', '=', userId)
    //         // .groupBy('receiver_id')
    //         .orderBy('sent_at', 'desc')
    //         .execute();
    //     return result.map(
    //         r =>
    //             new Message(
    //                 r.id as UUID,
    //                 r.user_id as UUID,
    //                 r.receiver_id as UUID,
    //                 r.content,
    //                 r.sent_at
    //             )
    //     );

    // }

    async addMessage(
        userId: UUID,
        receiverId: UUID,
        content: string
    ): Promise<Message> {
        const result = await this.db
            .insertInto('messages')
            .values({
                id: crypto.randomUUID(),
                user_id: userId,
                receiver_id: receiverId,
                content: content
            })
            .returning(['id', 'sent_at'])
            .executeTakeFirstOrThrow();

        return new Message(
            result.id as UUID,
            userId,
            receiverId,
            content,
            result.sent_at
        );
    }
}
