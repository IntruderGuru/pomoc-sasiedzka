import { UUID } from 'crypto';

export class Message {
    constructor(
        readonly id: number,
        readonly senderId: UUID,
        readonly receiverId: UUID,
        private content: string,
        readonly sent_at: Date
    ) {}

    getContent(): string {
        return this.content;
    }
}
