import ReactionButton from './ReactionButton';

export default function CommentItem({ comment, showDelete, onDelete }) {
    return (
        <div className="border p-2 rounded">
            <div className="flex justify-between text-sm text-gray-600">
                <span>{comment.author}</span>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p className="my-1">{comment.content}</p>
            <div className="flex items-center gap-2">
                <ReactionButton targetType="comment" targetId={comment.id} />
                {showDelete && (
                    <button onClick={onDelete} className="text-red-500 text-sm hover:underline">
                        Usuń
                    </button>
                )}
            </div>
        </div>
    );
}
