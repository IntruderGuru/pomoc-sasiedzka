import { useState } from 'react';
import { sendMessage } from '../services/MessagesService.ts';

export default function MessageForm({ withuserId, onNewMessage }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const newMsg = await sendMessage(withuserId, content);
            onNewMessage(newMsg);
            setContent('');
        } catch (err) {
            alert('Błąd podczas wysyłania wiadomości');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-2 flex gap-2 border-t">
            <textarea
                className="flex-1 p-2 border rounded"
                placeholder="Napisz wiadomość..."
                value={content}
                onChange={e => setContent(e.target.value)}
                disabled={loading}
            />
            <button type="submit" disabled={loading || !content.trim()} className="bg-blue-600 text-white px-4 py-2 rounded">
                Wyślij
            </button>
        </form>
    );
}
