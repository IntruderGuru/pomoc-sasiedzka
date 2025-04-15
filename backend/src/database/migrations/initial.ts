import { Kysely, sql } from 'kysely';
import { Database } from '../connection';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable('users')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('name', 'varchar(256)', column => column.notNull())
        .addColumn('password', 'varchar(256)', column => column.notNull())
        .execute();

    await db.schema
        .createTable('annoucements')
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
        .addColumn('createdAt', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('users').execute();
    await db.schema.dropTable('annoucements').execute();
}
