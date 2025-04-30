import dotenv from 'dotenv';
import { Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

dotenv.config();

export interface Database {
    users: UsersTable;
    announcements: AnnouncementsTable;
    messages: MessagesTable;
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
    created_at: Date;
}

export interface MessagesTable {
    id: Generated<number>;
    sender_id: string;
    receiver_id: string;
    content: string;
    sent_at: Date;
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
