import { UUID } from 'crypto';

export class Category {
    constructor(
        readonly id: UUID,
        private name: string,
        readonly createdAt: Date
    ) { }

    getName() { return this.name; }
}
