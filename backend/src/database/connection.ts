import dotenv from 'dotenv';
import { Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

export interface Database {
    users: UsersTable;
    announcements: AnnouncementsTable;
    messages: MessagesTable;
    comments: CommentsTable;
    reactions: ReactionTable;
}

export interface UsersTable {
    id: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export interface AnnouncementsTable {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: string;
    type: string;
    created_at: Generated<Date>;
}

export interface MessagesTable {
    id: Generated<number>;
    sender_id: string;
    receiver_id: string;
    content: string;
    sent_at: Generated<Date>;
}

export interface CommentsTable {
    id: Generated<number>;
    announcement_id: string;
    sender_id: string;
    content: string;
    sent_at: Generated<Date>;
}

export interface ReactionTable {
    id: Generated<number>;
    announcement_id: string;
    user_id: string;
    comment_id: string;
    type: string;
    sent_at: Generated<Date>;
}


export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5434,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'somsiad'
        })
    })
});
