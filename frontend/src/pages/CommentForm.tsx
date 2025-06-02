import { useState } from 'react';
import { addComment } from '../services/CommentService.ts';
import { UUID } from 'crypto'
import {useNavigate} from "react-router";

export default function CommentForm({ announcementId, onReload }) {
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) return;
        await addComment(announcementId, { content });
        setContent('');
        onReload();
        // Ideally use callback to update parent or trigger reload
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
            <textarea
                className="p-4 m-2 bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl"
                placeholder="Dodaj komentarz..."
                value={content}
                onChange={e => setContent(e.target.value)}
            />
            <button type="submit" disabled={!content.trim()} className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue">
                Dodaj
            </button>
        </form>
    );
}
