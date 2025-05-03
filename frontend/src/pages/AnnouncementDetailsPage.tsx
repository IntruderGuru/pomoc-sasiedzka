import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { fetchById} from '../services/AnnouncementService.ts';
import ReactionButton from './ReactionButton';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { UUID } from 'crypto'

export default function AnnouncementDetailsPage() {
    interface Announcement {
        id: UUID;
        title: string;
        content: string;
        category: string;
        type: string;
        userId: UUID;
        createdAt: string;
    }
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState<Announcement>();
    const [loading, setLoading] = useState(true);

    const getAnnouncement = async () => {
        const announcement = await fetchById(id);
        setAnnouncement(announcement.data as Announcement);
        setLoading(false);
    }

    useEffect(() => {
        getAnnouncement();
    }, []);

    if (loading) return <Spinner />;
    if (!announcement) return <p>Nie znaleziono ogłoszenia.</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{announcement.title}</h1>
            <p className="text-gray-700">{announcement.content}</p>
            <p className="text-sm text-gray-500">
                {announcement.category} • {announcement.type} •{' '}
                {new Date(announcement.createdAt).toLocaleString()} • {announcement.userId}
            </p>

            <div className="my-2">
                <ReactionButton targetType="announcement" targetId={id!} />
            </div>

            <CommentList announcementId={id!} />
            <CommentForm announcementId={id!} />
        </div>
    );
}
