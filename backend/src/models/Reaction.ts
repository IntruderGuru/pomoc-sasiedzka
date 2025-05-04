import { UUID } from 'crypto';

export class Reaction {
    constructor(
        readonly id: number,
        readonly announcementId: UUID,
        readonly userId: UUID,
        readonly commentId: UUID,
        private type: string,
        readonly sent_at: Date
    ) {}

    getContent(): string {
        return this.type;
    }
}
