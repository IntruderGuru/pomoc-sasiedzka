import { UUID } from 'crypto';

export class Reaction {
    constructor(
        readonly id: UUID,
        readonly itemId: UUID,
        readonly userId: UUID,
        private type: string,
        readonly sent_at: Date
    ) { }

    getContent(): string {
        return this.type;
    }
}
