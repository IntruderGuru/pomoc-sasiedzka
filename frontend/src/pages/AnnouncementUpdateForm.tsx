import { useEffect, useState } from 'react';
import { fetchById, update } from '../services/AnnouncementService';
import Spinner from '../components/Spinner';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
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
        fetchById(id)
            .then(res => {
                const announcement = res.data;
                setTitle(announcement.title);
                setContent(announcement.content);
                setCategory(announcement.category);
                setType(announcement.type);
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
        <div className="min-h-screen bg-gradient-to-br from-blueGradientStart to-blueGradientEnd flex flex-col items-center justify-center p-8">
            <Nav />
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row">
                <input
                    className="p-4 max-h-fit bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
                    placeholder='Tytuł'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
                <textarea
                    className="p-4 max-h-fit bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
                    placeholder='Treść'
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                />
                <input
                    className="p-4 max-h-fit bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
                    placeholder='Kategoria'
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    required
                />
                <input
                    className="p-4 max-h-fit bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
                    placeholder='Typ'
                    value={type}
                    onChange={e => setType(e.target.value)}
                    required
                />
                <button className="font-bold max-h-fit px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" type="submit">{'Zapisz zmiany'}</button>
            </form>
        </div>
    );
}
