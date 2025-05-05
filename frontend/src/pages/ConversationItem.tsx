export default function ConversationItem({ withuserId, lastMessage, sentAt, onClick }) {
    return (
        <div onClick={onClick} className="cursor-pointer p-4 border-b hover:bg-gray-100">
            <div className="text-sm text-gray-600">{lastMessage}</div>
            <div className="text-xs text-gray-400">{new Date(sentAt).toLocaleString()}</div>
        </div>
    );
}
