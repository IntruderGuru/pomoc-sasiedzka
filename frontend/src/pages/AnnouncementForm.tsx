import { useEffect, useState } from 'react';
import { create, fetchById, update } from '../services/AnnouncementService';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function AnnouncementForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(!!id);

    const loggedUserId = localStorage.getItem('userId');

    const isValid = title.trim() && content.trim();

    useEffect(() => {
        if (id) {
            fetchById(id).then((res) => {
                setTitle(res.data.title);
                setContent(res.data.content);
                setCategory(res.data.category || '');
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return alert('Wszystkie pola muszą być wypełnione');

        const data = { title, content, category, userId: loggedUserId };

        if (id) {
            await update(id, data);
            alert('Ogłoszenie zaktualizowane');
        } else {
            await create(data);
            alert('Ogłoszenie dodane');
        }

        navigate('/announcements');
    };

    if (loading) return <Spinner />;

    return (
        <form onSubmit={handleSubmit}>
            <h2>{id ? 'Edytuj' : 'Dodaj'} ogłoszenie</h2>
            <input placeholder="Tytuł" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea placeholder="Treść" value={content} onChange={e => setContent(e.target.value)} required />
            <input placeholder="Kategoria (opcjonalnie)" value={category} onChange={e => setCategory(e.target.value)} />
            <button type="submit">{id ? 'Zapisz zmiany' : 'Dodaj ogłoszenie'}</button>
        </form>
    );
}
