import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchThread } from '../services/MessagesService.ts';
import MessageBubble from './MessageBubble';
import MessageForm from './MessageForm';
import Spinner from '../components/Spinner';
import { UUID } from 'crypto';

export default function MessageThreadPage() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getThread = async () => {
        const response = await fetchThread(id as UUID);
        setMessages(response.data);
        setLoading(false);
    };

    useEffect(() => {
        getThread();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) return <Spinner />;
    if (messages.length === 0) return <p>Brak wiadomości.</p>;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4 space-y-2">
                {messages.map(m => (
                    <MessageBubble key={m.id} message={m} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            {/* <MessageForm withuserId={withuserId!} onNewMessage={msg => setMessages([...messages, msg])} /> */}
        </div>
    );
}
