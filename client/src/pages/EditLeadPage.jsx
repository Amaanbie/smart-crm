import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getLead, updateLead } from '../api/leads.api.js';
import LeadForm from '../components/leads/LeadForm.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export default function EditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getLead(id).then((l) => setLead(l)).catch(() => setError('Lead not found'));
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await updateLead(id, data);
      navigate(`/leads/${id}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return <PageSpinner />;

  const defaults = {
    ...lead,
    expectedCloseDate: lead.expectedCloseDate
      ? new Date(lead.expectedCloseDate).toISOString().slice(0, 10)
      : '',
    assignedToId: lead.assignedToId || '',
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/leads/${id}`)}>
          <ArrowLeft size={16} /> Back
        </Button>
        <h2 className="text-xl font-semibold text-slate-900">Edit Lead — {lead.name}</h2>
      </div>
      <Card>
        {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <LeadForm onSubmit={onSubmit} loading={loading} defaultValues={defaults} />
      </Card>
    </div>
  );
}
