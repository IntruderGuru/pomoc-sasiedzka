import { useEffect, useState } from 'react';
import { fetchByUser, remove } from '../services/AnnouncementService';
import Spinner from '../components/Spinner';
import { getuserId } from '../services/api.ts';
import { UUID } from 'crypto'
import Nav from "../components/Nav.tsx";
import { useNavigate } from "react-router";

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
    const loggeduserId = getuserId();

    const getData = async () => {
        const announcements = await fetchByUser(loggeduserId);
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
        <div>
            <Nav />
            <h1>Moje Ogłoszenia</h1>
            <ul>
                {announcements.map((a) => (
                    <li key={a.id}>
                        <h3>{a.title}</h3>
                        <p>{a.content}</p>
                        <p>
                            {/* <i>{a.category}</i> —  */}
                            {a.userId} ({a.createdAt})</p>


                        <button onClick={() => handleDelete(a.id)}>Usuń</button>
                        <button onClick={() => navigate(`/announcements/${a.id}`)}>Edytuj</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
