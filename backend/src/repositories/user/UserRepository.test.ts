import { describe, expect, it, vi } from 'vitest';

import { User } from '../../models/User';
import { UserRepository } from '../user/UserRepository';

describe('UserRepository', () => {
    const mockDb: any = {
        selectFrom: vi.fn().mockReturnThis(),
        insertInto: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        selectAll: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        execute: vi.fn()
    };

    it('addUser should insert a new user and return it', async () => {
        const userRepo = new UserRepository(mockDb);
        await userRepo.addUser('kuki@example.com', 'summertime', 'user');

        expect(mockDb.insertInto).toHaveBeenCalledWith('users');
        expect(mockDb.values).toHaveBeenCalled();
        expect(mockDb.execute).toHaveBeenCalled();
    });

    it('getUserByEmail should return a User object if found', async () => {
        mockDb.execute = vi.fn().mockResolvedValue([
            {
                id: '123e4567-e89b-12d3-a456-426614174000',
                password: 'summertime',
                role: 'admin'
            }
        ]);

        const userRepo = new UserRepository(mockDb);
        const user = await userRepo.getUserByEmail('kuki@example.com');

        expect(user).toBeInstanceOf(User);
        expect(user?.getEmail()).toBe('kuki@example.com');
        expect(user?.getPassword()).toBe('summertime');
        expect(user?.getRole()).toBe('admin');
    });

    it('getUserByEmail should return null if user not found', async () => {
        mockDb.execute = vi.fn().mockResolvedValue([]);

        const userRepo = new UserRepository(mockDb);
        const user = await userRepo.getUserByEmail('kuki@example.com');

        expect(user).toBeNull();
    });
});
