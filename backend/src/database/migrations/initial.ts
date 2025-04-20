import { Kysely, sql } from 'kysely';
import { Database } from '../connection';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable('users')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('email', 'varchar(256)', column => column.notNull())
        .addColumn('password', 'varchar(60)', column => column.notNull())
        .addColumn('role', 'varchar(5)', column =>
            column.notNull().check(sql`role IN ('user', 'admin')`)
        )
        .execute();

    await db
        .insertInto('users')
        .values({
            id: '72fdabd7-5a84-474b-88b2-6411ec5fc30',
            email: 'yakui@gmail.com',
            password:
                '$2b$10$mK1suCUDB6lSPDXqFoo94.wBL/z6UYPyBfZnWYjL3SE86Tji0y7Q',
            role: 'admin'
        })
        .execute();

    await db.schema
        .createTable('announcements')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('userId', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('title', 'varchar(256)', column => column.notNull())
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('createdAt', 'timestamptz', column => column.notNull())
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('announcements').execute();
    await db.schema.dropTable('users').execute();
}
