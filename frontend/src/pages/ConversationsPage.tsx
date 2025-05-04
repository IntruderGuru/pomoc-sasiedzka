import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConversations } from '../services/MessagesService.ts';
import Spinner from '../components/Spinner';
import ConversationItem from "./ConversationItem.tsx";
import Nav from "../components/Nav.tsx";

export default function ConversationsPage() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getData = async () => {
        const conversations = await fetchConversations();
        setConversations(conversations);
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    if (loading) return <Spinner />;
    if (conversations.length === 0) return <p>Brak wiadomości.</p>;

    return (
        <div>
            <Nav />
            {conversations.map(c => (
                <ConversationItem key={c.withuserId} {...c} onClick={() => navigate(`/messages/${c.withuserId}`)} />
            ))}
        </div>
    );
}
