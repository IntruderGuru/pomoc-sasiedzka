import { useEffect, useState } from 'react';
import { create, fetchById, update } from '../services/AnnouncementService';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function AnnouncementForm() {
    const { id } = useParams();
    // const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(!!id);

    const isValid = title.trim() && content.trim();

    useEffect(() => {
        if (id) {
            fetchById(id).then((res) => {
                const data = res.data as { title: string; content: string };
                setTitle(data.title);
                setContent(data.content);
                // setCategory(data.category || '');
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return alert('Wszystkie pola muszą być wypełnione');

        const data = { title, content };

        if (id) {
            await update(id, data);
            alert('Ogłoszenie zaktualizowane');
        } else {
            await create(data);
            alert('Ogłoszenie dodane');
        }

        // navigate('/announcements');
    };

    if (loading) return <Spinner />;

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? 'Edytuj' : 'Dodaj'} ogłoszenie</h2>
            <input placeholder="Tytuł" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Treść" value={content} onChange={e => setContent(e.target.value)} required />
            {/* <input placeholder="Kategoria (opcjonalnie)" value={category} onChange={e => setCategory(e.target.value)} /> */}
            <button type="submit">{id ? 'Zapisz zmiany' : 'Dodaj ogłoszenie'}</button>
        </form>
    );
}
