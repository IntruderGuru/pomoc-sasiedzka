import { UUID } from 'crypto';

export class AuditLog {
    constructor(
        readonly id: UUID,
        readonly userId: UUID | null,
        readonly action: string,
        readonly entity: string,
        readonly entityId: UUID | null,
        readonly details: unknown,
        readonly createdAt: Date
    ) { }
}
