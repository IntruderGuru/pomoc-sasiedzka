import { useEffect, useState } from 'react';
import {fetchByUser, remove} from '../services/AnnouncementService';
import Spinner from '../components/Spinner';
import { UUID } from 'crypto';
import { useNavigate } from "react-router";
import Nav from "../components/Nav.tsx";
import AnnouncementCard from "./AnnouncementCard.tsx";
import {getuserId} from "../services/api.ts";

export default function MyAnnouncementsPage() {
    interface Announcement {
        id: UUID;
        title: string;
        content: string;
        category: string;
        userId: UUID;
        createdAt: string;
    }
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);


    const getData = async () => {
        const announcements = await fetchByUser(getuserId());
        setAnnouncements(announcements.data as Announcement[]);
        setLoading(false);
    };

    const handleDelete = async (id: UUID) => {
        await remove(id);
        alert('Ogłoszenie usunięte');
        getData();
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blueGradientStart to-blueGradientEnd flex flex-col items-center justify-center p-8">
            <Nav />
            <h1 className="text-white">Moje Ogłoszenia</h1>
            <ul>
                {announcements.map(a => (
                    <li key={a.id} onClick={() => navigate(`/announcements/${a.id}/details`)}>
                        <AnnouncementCard key={a.id} a={a} handleDelete={() => handleDelete(a.id)} />
                    </li>
                ))}
            </ul>
        </div>
    );
}
