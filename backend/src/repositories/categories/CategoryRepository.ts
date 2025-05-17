import { UUID } from 'crypto';
import { Kysely } from 'kysely';

import { Database } from '../../database/connection';
import { Category } from '../../models/Category';

export class CommentRepository {
    constructor(private db: Kysely<Database>) {}
}
