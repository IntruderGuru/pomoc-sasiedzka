import { useEffect, useState } from 'react';
import { fetchAll, remove } from '../services/AnnouncementService';
import Spinner from '../components/Spinner';
import { getuserId, getUsername } from "../services/api.ts";
import { UUID } from 'crypto';
import { useNavigate } from "react-router";
import Nav from "../components/Nav.tsx";

export default function AnnouncementsPage() {
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
    const loggeduserUsername = getUsername();


    const getData = async () => {
        const announcements = await fetchAll();
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
            <h1>Ogłoszenia</h1>
            <ul>
                {announcements.map((a) => (
                    <li key={a.id} onClick={() => navigate(`/announcements/${a.id}/details`)}>
                        <h3>{a.title}</h3>
                        <p>{a.content}</p>
                        <p>
                            {/* <i>{a.category}</i> —  */}
                            {a.userId} ({a.createdAt}) {loggeduserId}</p>

                        {a.userId == loggeduserId && (
                            <>
                                <button onClick={() => handleDelete(a.id)}>Usuń</button>
                                <button onClick={() => navigate(`/announcements/${a.id}`)}>Edytuj</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
