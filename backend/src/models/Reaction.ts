import { UUID } from 'crypto';

export class Reaction {
    constructor(
        readonly id: UUID,
        readonly announcementId: UUID | null,
        readonly commentId: UUID | null,
        readonly userId: UUID,
        private type: string
    ) {}

    getContent(): string {
        return this.type;
    }
}
