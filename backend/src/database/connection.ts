import dotenv from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

dotenv.config();

export interface Database {
    users: UsersTable;
    announcements: AnnouncementTable;
}

export interface UsersTable {
    id: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export interface AnnouncementTable {
    id: string;
    userId: string;
    title: string;
    content: string;
    category: string;
    type: string;
    createdAt: Date;
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
