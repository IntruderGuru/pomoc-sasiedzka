import { useEffect, useState } from "react";
import { fetchCommentsMod, removeComment } from "../services/AdminService";
import { Toast } from "../components/Toast.tsx";
import { Spinner } from "../components/Spinner.tsx";
import { ConfirmModal } from "../components/ConfirmModal.tsx";


export const CommentsModerationPage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComment, setSelectedComment] = useState(null);

    async function loadComments() {
        const _comments = await fetchCommentsMod();
        setComments(_comments.data);
        console.log(_comments.data);
        setLoading(false);
    }

    useEffect(() => {
        loadComments();
    }, []);

    const handleDelete = async () => {
        await removeComment(selectedComment.id);
        Toast.success("Comment deleted");
        setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
        setSelectedComment(null);
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Moderate Comments</h1>
            <ul className="space-y-2">
                {comments.map((comment) => (
                    <li
                        key={comment.id}
                        className="bg-white p-3 rounded shadow flex justify-between items-center"
                    >
                        <div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                            <p className="text-xs text-gray-400">{comment.author}</p>
                        </div>
                        <button
                            className="text-red-600"
                            onClick={() => setSelectedComment(comment)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {selectedComment && (
                <ConfirmModal
                    title="Delete comment?"
                    onConfirm={handleDelete}
                    onCancel={() => setSelectedComment(null)}
                >
                    Are you sure you want to delete this comment?
                </ConfirmModal>
            )}
        </div>
    );
};
