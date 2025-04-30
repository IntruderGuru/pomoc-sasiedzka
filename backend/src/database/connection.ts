import dotenv from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Load environment variables from .env file
dotenv.config();

/**
 * Interface representing the `users` table.
 * Stores authentication and role information for each user.
 */
export interface UsersTable {
    id: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

/**
 * Interface representing the `announcements` table.
 * Contains user-generated content such as offers or requests.
 */
export interface AnnouncementTable {
    id: string;
    userId: string;
    title: string;
    content: string;
    category: string;
    type: string;
    createdAt: Date;
}

/**
 * Interface representing the `messages` table.
 * Used to store private messages between users.
 */
export interface MessageTable {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    sent_at: Date;
}

/**
 * Interface representing the `comments` table.
 * Stores comments that users leave on announcements.
 */
export interface CommentTable {
    id: string;
    announcement_id: string;
    user_id: string;
    content: string;
    created_at: Date;
}

/**
 * Interface representing the `reactions` table.
 * Allows users to like or dislike announcements and comments.
 */
export interface ReactionTable {
    id: string;
    user_id: string;
    announcement_id: string | null;
    comment_id: string | null;
    type: string;
    created_at: Date;
}

/**
 * Global `Database` interface that maps table names to their TypeScript representations.
 * This is used by Kysely to provide strong typing for queries.
 */
export interface Database {
    users: UsersTable;
    announcements: AnnouncementTable;
    messages: MessageTable;
    comments: CommentTable;
    reactions: ReactionTable;
}

/**
 * Database client instance using Kysely ORM.
 * Configured to connect to PostgreSQL using environment variables or default fallbacks.
 */
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
