import { db } from '../database/connection';
import { Request, Response } from 'express';

export async function getDashboard(_req: Request, res: Response) {
    const [users] = await db.selectFrom('users').select(db.fn.countAll().as('c')).execute();
    const [ann] = await db.selectFrom('announcements').select(db.fn.countAll().as('c')).execute();
    const [pend] = await db.selectFrom('announcements').select(db.fn.count('id').as('c'))
        .where('status', '=', 'pending').execute();
    const [comments] = await db.selectFrom('comments').select(db.fn.countAll().as('c')).execute();
    res.json({
        users: Number(users.c),
        announcements: Number(ann.c),
        pending: Number(pend.c),
        comments: Number(comments.c)
    });
}
