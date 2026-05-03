import { useState, useEffect, useCallback } from 'react';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getLeads, updateLead, updateLeadStatus } from '../api/leads.api.js';
import KanbanColumn from '../components/kanban/KanbanColumn.jsx';
import KanbanDragOverlay from '../components/kanban/KanbanDragOverlay.jsx';
import LeadForm from '../components/leads/LeadForm.jsx';
import Modal from '../components/ui/Modal.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'];

export default function KanbanPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    getLeads({ limit: 200 })
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  }, []);

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s);
    return acc;
  }, {});

  const handleDragStart = useCallback(({ active }) => {
    setActiveLead(leads.find((l) => l.id === active.id) || null);
  }, [leads]);

  const handleDragEnd = useCallback(async ({ active, over }) => {
    setActiveLead(null);
    if (!over) return;

    const leadId = active.id;
    // Destination is either a column id (status) or a card id — resolve column
    const destStatus = STATUSES.includes(over.id)
      ? over.id
      : leads.find((l) => l.id === over.id)?.status;

    if (!destStatus) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status === destStatus) return;

    const snapshot = leads;
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: destStatus } : l));

    try {
      await updateLeadStatus(leadId, destStatus);
    } catch {
      setLeads(snapshot);
    }
  }, [leads]);

  const handleEditOpen = useCallback((lead) => {
    setEditError('');
    setEditLead(lead);
  }, []);

  const handleEditClose = useCallback(() => {
    setEditLead(null);
    setEditError('');
  }, []);

  const handleEditSubmit = useCallback(async (data) => {
    if (!editLead) return;
    setEditLoading(true);
    setEditError('');
    try {
      const updated = await updateLead(editLead.id, data);
      setLeads((prev) => prev.map((l) => l.id === updated.id ? { ...l, ...updated } : l));
      setEditLead(null);
    } catch (e) {
      setEditError(e.response?.data?.message || 'Failed to update lead');
    } finally {
      setEditLoading(false);
    }
  }, [editLead]);

  if (loading) return <PageSpinner />;

  const editDefaults = editLead && {
    ...editLead,
    expectedCloseDate: editLead.expectedCloseDate
      ? new Date(editLead.expectedCloseDate).toISOString().slice(0, 10)
      : '',
    assignedToId: editLead.assignedToId || '',
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Sales Pipeline</h2>
        <p className="text-sm text-slate-500 mt-0.5">Click a card to edit · drag to change stage</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} leads={grouped[status]} onEdit={handleEditOpen} />
          ))}
        </div>
        <KanbanDragOverlay activeLead={activeLead} />
      </DndContext>

      <Modal
        open={!!editLead}
        onClose={handleEditClose}
        title={editLead ? `Edit Lead — ${editLead.name}` : ''}
        size="xl"
      >
        {editLead && (
          <>
            {editError && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {editError}
              </div>
            )}
            <LeadForm
              defaultValues={editDefaults}
              onSubmit={handleEditSubmit}
              loading={editLoading}
            />
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
              <Link
                to={`/leads/${editLead.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Open full detail <ExternalLink size={14} />
              </Link>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
