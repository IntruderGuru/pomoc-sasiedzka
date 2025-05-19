import bcrypt from 'bcrypt';
// For dev
import { randomUUID } from 'crypto';
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

    await db.schema
        .createTable('announcements')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('title', 'varchar(256)', column => column.notNull())
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('category', 'varchar(256)', column => column.notNull())
        .addColumn('type', 'varchar(256)', column => column.notNull())
        .addColumn('status', 'varchar(8)', column =>
            column
                .notNull()
                .check(sql`status IN ('pending', 'approved', 'rejected')`)
                .defaultTo('pending')
        )
        .addColumn('created_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('messages')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('receiver_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('sent_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('comments')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('announcement_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('announcements.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('content', 'varchar(256)', column => column.notNull())
        .addColumn('sent_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('reactions')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('announcement_id', 'varchar(36)', column =>
            column
                .references('announcements.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('comment_id', 'varchar(36)', column =>
            column
                .references('comments.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('type', 'varchar(7)', column =>
            column.notNull().check(sql`type IN ('like', 'dislike')`)
        )
        .execute();

    await db.schema
        .createTable('categories')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('name', 'varchar(256)', column => column.notNull().unique())
        .addColumn('created_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    await db.schema
        .createTable('audit_logs')
        .addColumn('id', 'varchar(36)', column => column.primaryKey())
        .addColumn('user_id', 'varchar(36)', column =>
            column
                .notNull()
                .references('users.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('action', 'varchar(256)', column => column.notNull())
        .addColumn('announcement_id', 'varchar(36)', column =>
            column
                .references('announcements.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('comment_id', 'varchar(36)', column =>
            column
                .references('comments.id')
                .onUpdate('cascade')
                .onDelete('cascade')
        )
        .addColumn('created_at', 'timestamptz', column =>
            column.notNull().defaultTo(sql`NOW()`)
        )
        .execute();

    // For dev
    await db
        .insertInto('users')
        .values({
            id: randomUUID(),
            email: 'yakui@example.com',
            password: await bcrypt.hash('themaid', 10),
            role: 'admin'
        })
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('messages').execute();
    await db.schema.dropTable('reactions').execute();
    await db.schema.dropTable('audit_logs').execute();
    await db.schema.dropTable('comments').execute();
    await db.schema.dropTable('announcements').execute();
    await db.schema.dropTable('users').execute();
    await db.schema.dropTable('categories').execute();
}
