import { UUID } from 'crypto';

export class Announcement {
    constructor(
        readonly id: UUID,
        readonly userId: UUID,
        private title: string,
        private content: string,
        private category: string,
        private type: string,
        readonly createdAt: Date
    ) {}

    getTitle(): string {
        return this.title;
    }

    getContent(): string {
        return this.content;
    }

    getCategory(): string {
        return this.category;
    }

    getType(): string {
        return this.type;
    }
}
