import { UUID } from 'crypto';

export class Message {
    constructor(
        readonly id: UUID,
        readonly userId: UUID,
        readonly receiverId: UUID,
        private content: string,
        readonly sent_at: Date
    ) { }

    getContent(): string {
        return this.content;
    }
}
