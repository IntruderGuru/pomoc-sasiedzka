import { useEffect, useState } from 'react';
import { addReaction, removeReaction } from '../services/ReactionsService';

export default function ReactionButton({ targetType, targetId }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Fetch initial state if API provides it (or pass from parent)
        // Placeholder values here:
        setLiked(false);
        setCount(Math.floor(Math.random() * 10)); // replace with actual data
    }, [targetId]);

    const toggle = async () => {
        if (liked) {
            await removeReaction(targetType, targetId);
            setCount(c => c - 1);
        } else {
            await addReaction(targetType, targetId);
            setCount(c => c + 1);
        }
        setLiked(!liked);
    };

    return (
        <button onClick={toggle} className={`text-sm ${liked ? 'text-blue-600' : 'text-gray-500'}`}>
            ❤️ {count}
        </button>
    );
}
