export default function MessageBubble({ message }) {
    const currentUserId = localStorage.getItem('userId');
    const isOwn = message.senderId === currentUserId;
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-2 rounded-xl max-w-xs ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                <div>{message.content}</div>
                <div className="text-xs text-right">{new Date(message.sentAt).toLocaleTimeString()}</div>
            </div>
        </div>
    );
}
