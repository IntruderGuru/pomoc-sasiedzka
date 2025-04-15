import { useEffect, useState } from 'react';
import { fetchAll, remove } from '../services/AnnouncementService';
import Spinner from '../components/Spinner';

export default function AnnouncementsPage() {
    interface Announcement {
        id: string;
        title: string;
        content: string;
        category: string;
        userId: string;
        createdAt: string;
    }

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();
    const loggedUserId = localStorage.getItem('userId');

    const getData = async () => {
        const announcements = await fetchAll();
        setAnnouncements(announcements.data as Announcement[]);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
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
            <h1>Ogłoszenia</h1>
            {/* <button onClick={() => navigate('/announcements/create')}>Dodaj ogłoszenie</button> */}
            <ul>
                {announcements.map((a) => (
                    <li key={a.id}>
                        <h3>{a.title}</h3>
                        <p>{a.content}</p>
                        <p>
                            {/* <i>{a.category}</i> —  */}
                            {a.userId} ({a.createdAt})</p>

                        {a.userId === loggedUserId && (
                            <>
                                {/* <button onClick={() => navigate(`/announcements/${a.id}`)}>Edytuj</button> */}
                                <button onClick={() => handleDelete(a.id)}>Usuń</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
