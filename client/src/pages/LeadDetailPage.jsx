import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import { getLead, deleteLead } from '../api/leads.api.js';
import { useActivities } from '../hooks/useActivities.js';
import { useNotes } from '../hooks/useNotes.js';
import LeadInfoPanel from '../components/lead-detail/LeadInfoPanel.jsx';
import ActivityTimeline from '../components/lead-detail/ActivityTimeline.jsx';
import ActivityForm from '../components/lead-detail/ActivityForm.jsx';
import NotesList from '../components/lead-detail/NotesList.jsx';
import LeadInsightPanel from '../components/lead-detail/LeadInsightPanel.jsx';
import Modal from '../components/ui/Modal.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  const { activities, createActivity, toggleComplete, deleteActivity } = useActivities(id);
  const { notes, createNote, deleteNote } = useNotes(id);

  useEffect(() => {
    getLead(id).then(setLead).catch(() => navigate('/leads'));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
    await deleteLead(id);
    navigate('/leads');
  };

  const handleCreateActivity = async (data) => {
    setActivityLoading(true);
    try {
      await createActivity(data);
      setActivityModalOpen(false);
    } finally {
      setActivityLoading(false);
    }
  };

  if (!lead) return <PageSpinner />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            {lead.company && <p className="text-sm text-slate-500">{lead.company}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/leads/${id}/edit`)}>
            <Edit2 size={14} /> Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left — lead info */}
        <Card className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Lead Information</h3>
          <LeadInfoPanel lead={lead} />
        </Card>

        {/* Center — activities + notes */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Activities</h3>
              <Button size="sm" onClick={() => setActivityModalOpen(true)}>
                <Plus size={14} /> Add Activity
              </Button>
            </div>
            <ActivityTimeline activities={activities} onToggle={toggleComplete} onDelete={deleteActivity} />
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Notes</h3>
            <NotesList notes={notes} onCreate={createNote} onDelete={deleteNote} />
          </Card>
        </div>

        {/* Right — insights */}
        <Card className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Lead Insights</h3>
          <LeadInsightPanel lead={lead} activities={activities} />
        </Card>
      </div>

      <Modal
        open={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        title="Add Activity"
      >
        <ActivityForm onSubmit={handleCreateActivity} loading={activityLoading} />
      </Modal>
    </div>
  );
}
