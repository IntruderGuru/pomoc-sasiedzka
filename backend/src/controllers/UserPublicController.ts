import { Request, Response } from 'express';
import { db } from '../database/connection';

export class UserPublicController {
    static async getUsernameById(req: Request, res: Response) {
        const userId = req.params.id;

        try {
            const result = await db
                .selectFrom('users')
                .select(['username'])
                .where('id', '=', userId)
                .executeTakeFirst();

            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ username: result.username });
        } catch (e: any) {
            console.error(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
