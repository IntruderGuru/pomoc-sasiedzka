import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchConversations } from '../services/MessagesService.ts';
import Spinner from '../components/Spinner';
import ConversationItem from "./ConversationItem.tsx";
import Nav from "../components/Nav.tsx";


export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    interface Conversation {
        id: string;
        userId: string;
        receiverId: string;
        content: string;
        sentAt: string;
    }



    const getData = async () => {

        const conversations = await fetchConversations();
        setConversations(conversations.data as Conversation[]);
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
                <ConversationItem withuserId={c.userId} lastMessage={c.content} sentAt={c.sentAt} onClick={() => navigate(`/messages/${c.receiverId}`)} />
            ))}
        </div>
    );
}
