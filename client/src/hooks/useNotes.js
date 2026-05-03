import { useState, useEffect, useCallback } from 'react';
import { getNotes, createNote as apiCreate, deleteNote as apiDelete } from '../api/notes.api.js';

export function useNotes(leadId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    try {
      const data = await getNotes(leadId);
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createNote = async (content) => {
    const note = await apiCreate(leadId, content);
    setNotes((prev) => [note, ...prev]);
    return note;
  };

  const deleteNote = async (id) => {
    await apiDelete(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, loading, createNote, deleteNote };
}
