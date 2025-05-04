import { UUID } from 'crypto';

export class Comment {
    constructor(
        readonly id: number,
        readonly announcementId: UUID,
        readonly senderId: UUID,
        private content: string,
        readonly sent_at: Date
    ) {}

    getContent(): string {
        return this.content;
    }
}
