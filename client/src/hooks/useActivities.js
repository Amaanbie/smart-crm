import { useState, useEffect, useCallback } from 'react';
import { getActivities, createActivity as apiCreate, updateActivity as apiUpdate, deleteActivity as apiDelete } from '../api/activities.api.js';

export function useActivities(leadId) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    try {
      const data = await getActivities(leadId);
      setActivities(data);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const createActivity = async (data) => {
    const activity = await apiCreate(leadId, data);
    setActivities((prev) => [activity, ...prev]);
    return activity;
  };

  const toggleComplete = async (id, completed) => {
    const updated = await apiUpdate(id, { completed });
    setActivities((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const deleteActivity = async (id) => {
    await apiDelete(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return { activities, loading, createActivity, toggleComplete, deleteActivity, refetch: fetch };
}
