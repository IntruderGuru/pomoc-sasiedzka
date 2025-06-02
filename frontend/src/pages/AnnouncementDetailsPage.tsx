import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import {fetchById, remove} from '../services/AnnouncementService.ts';

import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { UUID } from 'crypto'
import AnnouncementCard from "./AnnouncementCard.tsx";
import {useNavigate} from "react-router";

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
    const navigate = useNavigate();

    const getAnnouncement = async () => {
        const announcement = await fetchById(id);
        setAnnouncement(announcement.data as Announcement);
        setLoading(false);
    }

    useEffect(() => {
        getAnnouncement();
    }, []);

    const handleDelete = async (id: UUID) => {
        await remove(id);
        alert('Ogłoszenie usunięte');
        navigate("/announcements");
    };

    if (loading) return <Spinner />;
    if (!announcement) return <p>Nie znaleziono ogłoszenia.</p>;

    return (
        <div className="min-h-screen max-h-screen bg-gradient-to-br from-blueGradientStart to-blueGradientEnd flex flex-col items-center justify-center p-8">
            <AnnouncementCard a={announcement} handleDelete={()=> handleDelete(announcement.id)}/>

            <CommentList announcementId={id!} />
            <CommentForm announcementId={id!} onReload={() => window.location.reload()} />
        </div>
    );
}
