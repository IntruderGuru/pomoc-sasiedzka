import { UUID } from 'crypto';

export class Comment {
    constructor(
        readonly id: UUID,
        readonly announcementId: UUID,
        readonly userId: UUID,
        private content: string,
        readonly sent_at: Date
    ) { }

    getContent(): string {
        return this.content;
    }
}
