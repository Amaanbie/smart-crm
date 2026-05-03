import { useState, useEffect, useCallback } from 'react';
import { getLeads, deleteLead as apiDelete } from '../api/leads.api.js';

export function useLeads(filters) {
  const [result, setResult] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLeads(filters);
      setResult(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  const deleteLead = useCallback(async (id) => {
    await apiDelete(id);
    setResult((prev) => ({
      ...prev,
      data: prev.data.filter((l) => l.id !== id),
      total: prev.total - 1,
    }));
  }, []);

  return { ...result, loading, error, refetch: fetch, deleteLead };
}
