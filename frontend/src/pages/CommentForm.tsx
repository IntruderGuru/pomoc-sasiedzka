import { useState } from 'react';
import { addComment } from '../services/CommentService.ts';
import { UUID } from 'crypto'

export default function CommentForm({ announcementId }) {
    const [content, setContent] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        if (!content.trim()) return;

        await addComment(announcementId, content);
        setContent('');
        // Ideally use callback to update parent or trigger reload
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <textarea
          className="flex-1 p-2 border rounded"
          placeholder="Dodaj komentarz..."
          value={content}
          onChange={e => setContent(e.target.value)}
      />
            <button type="submit" disabled={!content.trim()} className="bg-green-600 text-white px-4 py-2 rounded">
                Dodaj
            </button>
        </form>
    );
}
