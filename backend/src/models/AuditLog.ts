import { UUID } from 'crypto';

export class AuditLog {
    constructor(
        readonly id: UUID,
        readonly user_id: UUID,
        readonly action: string,
        readonly announcement_id: UUID,
        readonly comment_id: UUID,
        readonly created_at: Date
    ) {}
}
