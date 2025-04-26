import { useEffect, useState } from 'react';
import { fetchById, update} from '../services/AnnouncementService';
import Spinner from '../components/Spinner';
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import Nav from "../components/Nav.tsx";

export default function AnnouncementUpdateForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(true);

    const isValid = title.trim() && content.trim();

    useEffect(() => {
        fetchById(id).then((res) => {
            setTitle(res.data.title);
            setContent(res.data.content);
            setCategory(res.data.category);
            setType(res.data.type);
            setLoading(false);
        });

    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return alert('Wszystkie pola muszą być wypełnione');

        const data = { title, content, category, type };
        await update(id, data);
        alert('Ogłoszenie zaktualizowane');
        navigate('/');
    };

    if (loading) return <Spinner />;

    return (
        <>
            <Nav />
        <form onSubmit={handleSubmit}>
            <h2>Edytuj ogłoszenie</h2>
            <input
                placeholder='Tytuł'
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder='Treść'
                value={content}
                onChange={e => setContent(e.target.value)}
                required
            />
            <input
                placeholder='Kategoria'
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
            />
            <input
                placeholder='Typ'
                value={type}
                onChange={e => setType(e.target.value)}
                required
            />
            <button type="submit">{'Zapisz zmiany'}</button>
        </form>
        </>
    );
}
