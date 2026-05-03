import { useState } from 'react';
import { Trash2, StickyNote, Send } from 'lucide-react';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function NotesList({ notes, onCreate, onDelete }) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try { await onCreate(content.trim()); setContent(''); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note…"
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={saving || !content.trim()}
          aria-label="Add note"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <Send size={16} />
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-slate-400">No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="flex gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg group">
              <StickyNote size={15} className="text-yellow-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-slate-400 mt-1">{fmtDate(note.createdAt)}</p>
              </div>
              <button
                onClick={() => onDelete(note.id)}
                aria-label="Delete note"
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
