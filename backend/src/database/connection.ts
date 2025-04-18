import dotenv from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

dotenv.config();

export interface Database {
    users: UsersTable;
}

export interface UsersTable {
    id: string;
    email: string;
    password: string;
}

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'somsiad1234',
            database: process.env.DB_NAME || 'somsiad'
        })
    })
});
