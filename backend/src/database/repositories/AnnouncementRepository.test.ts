import { describe, expect, it, vi } from 'vitest';
import { AnnouncementRepository } from './AnnouncementRepository';
import { Announcement } from '../../models/Announcement';
import { UUID } from 'crypto';

describe('AnnouncementRepository', () => {
    const mockDb: any = {
        selectFrom: vi.fn().mockReturnThis(),
        insertInto: vi.fn().mockReturnThis(),
        updateTable: vi.fn().mockReturnThis(),
        deleteFrom: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        selectAll: vi.fn().mockReturnThis(),
        execute: vi.fn()
    };

    it('getAllAnnoucement should return all annoucements', async () => {
        mockDb.execute = vi.fn().mockResolvedValue([
            {
                id: 'c9005bb9-d42e-441c-ac8d-642709f02b7',
                userId: 'f131ee94-7e48-4bc3-8cd8-752f775efc3',
                title: 'The Brain—is wider than the Sky',
                content: `
                    The Brain—is wider than the Sky—
                    For—put them side by side—
                    The one the other will contain
                    With ease—and You—beside—

                    The Brain is deeper than the sea—
                    For—hold them—Blue to Blue—
                    The one the other will absorb—
                    As Sponges—Buckets—do—

                    The Brain is just the weight of God—
                    For—Heft them—Pound for Pound—
                    And they will differ—if they do—
                    As Syllable from Sound— 
                `,
                category: 'literature',
                type: 'none',
                createdAt: new Date('1862')
            }
        ]);

        const announcementRepo = new AnnouncementRepository(mockDb);
        const announcements = await announcementRepo.getAllAnnoucements();

        const announcement = announcements[0];
        expect(announcement?.id).toBe('c9005bb9-d42e-441c-ac8d-642709f02b7');
        expect(announcement?.userId).toBe(
            'f131ee94-7e48-4bc3-8cd8-752f775efc3'
        );
        expect(announcement?.getTitle()).toBe(
            'The Brain—is wider than the Sky'
        );
        expect(announcement?.getContent()).toBe(`
                    The Brain—is wider than the Sky—
                    For—put them side by side—
                    The one the other will contain
                    With ease—and You—beside—

                    The Brain is deeper than the sea—
                    For—hold them—Blue to Blue—
                    The one the other will absorb—
                    As Sponges—Buckets—do—

                    The Brain is just the weight of God—
                    For—Heft them—Pound for Pound—
                    And they will differ—if they do—
                    As Syllable from Sound— 
                `);
        expect(announcement?.getCategory()).toBe('literature');
        expect(announcement?.getType()).toBe('none');
        expect(announcement?.createdAt).toStrictEqual(new Date('1862'));
    });

    it('getAnnoucementsByUserId should return all annoucements posted by user', async () => {
        mockDb.execute = vi.fn().mockResolvedValue([
            {
                id: 'c9005bb9-d42e-441c-ac8d-642709f02b7',
                userId: 'f131ee94-7e48-4bc3-8cd8-752f775efc3',
                title: 'Title',
                content: 'Content',
                category: 'Category',
                type: 'Type',
                createdAt: new Date('2003')
            }
        ]);

        const announcementRepo = new AnnouncementRepository(mockDb);
        const announcements = await announcementRepo.getAnnoucementsByUserId(
            'f131ee94-7e48-4bc3-8cd8-752f775efc3' as UUID
        );

        const announcement = announcements[0];
        expect(announcement).toBeInstanceOf(Announcement);
        expect(announcement?.id).toBe('c9005bb9-d42e-441c-ac8d-642709f02b7');
        expect(announcement?.userId).toBe(
            'f131ee94-7e48-4bc3-8cd8-752f775efc3'
        );
        expect(announcement?.getTitle()).toBe('Title');
        expect(announcement?.getContent()).toBe('Content');
        expect(announcement?.getCategory()).toBe('Category');
        expect(announcement?.getType()).toBe('Type');
        expect(announcement?.createdAt).toStrictEqual(new Date('2003'));
    });

    it('addAnnouncement should insert a new announcement and return it', async () => {
        const announcementRepo = new AnnouncementRepository(mockDb);
        await announcementRepo.addAnnoucement(
            'f131ee94-7e48-4bc3-8cd8-752f775efc3' as UUID,
            'Title',
            'Content',
            'Category',
            'Type'
        );

        expect(mockDb.insertInto).toHaveBeenCalledWith('announcements');
        expect(mockDb.values).toBeCalled();
        expect(mockDb.execute).toBeCalled();
    });

    it('updateAnnouncement should an update announcement', async () => {
        const announcementRepo = new AnnouncementRepository(mockDb);
        await announcementRepo.updateAnnoucement(
            'c9005bb9-d42e-441c-ac8d-642709f02b7' as UUID,
            'Title',
            'Content',
            'Category',
            'Type'
        );

        expect(mockDb.updateTable).toBeCalledWith('announcements');
        expect(mockDb.set).toBeCalled();
        expect(mockDb.where).toBeCalled();
        expect(mockDb.execute).toBeCalled();
    });

    it('deleteAnnouncement should delete an announcement', async () => {
        const announcementRepo = new AnnouncementRepository(mockDb);
        await announcementRepo.deleteAnnoucement(
            'c9005bb9-d42e-441c-ac8d-642709f02b7' as UUID
        );

        expect(mockDb.deleteFrom).toBeCalledWith('announcements');
        expect(mockDb.where).toBeCalled();
        expect(mockDb.execute).toBeCalled();
    });
});
