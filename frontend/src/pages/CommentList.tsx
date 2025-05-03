import { useEffect, useState } from 'react';
import { fetchComments, deleteComment } from '../services/CommentService.ts';
import Spinner from '../components/Spinner';
import CommentItem from './CommentItem';
import { UUID } from 'crypto'

export default function CommentList({ announcementId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('role') === 'admin';

    const loadComments = async () => {
        const comments = await fetchComments(announcementId);
        setComments(comments.data);
        setLoading(false);
    };

    useEffect(() => {
        loadComments();
    }, [announcementId]);

    const handleDelete = async (id: UUID) => {
        await deleteComment(id);
        loadComments();
    };

    if (loading) return <Spinner />;
    if (comments.length === 0) return <p>Brak komentarzy.</p>;

    return (
        <div className="space-y-2 my-4">
            {comments.map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    showDelete={comment.authorId === currentUserId || isAdmin}
                    onDelete={() => handleDelete(comment.id)}
                />
            ))}
        </div>
    );
}
