import { UUID } from 'crypto';

export class Category {
    constructor(
        readonly id: UUID,
        readonly category: string,
        readonly created_at: Date
    ) {}
}
