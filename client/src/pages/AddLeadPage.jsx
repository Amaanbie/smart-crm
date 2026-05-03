import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createLead } from '../api/leads.api.js';
import LeadForm from '../components/leads/LeadForm.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function AddLeadPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const lead = await createLead(data);
      navigate(`/leads/${lead.id}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <h2 className="text-xl font-semibold text-slate-900">Add New Lead</h2>
      </div>

      <Card>
        {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <LeadForm onSubmit={onSubmit} loading={loading} defaultValues={{ status: 'NEW', priority: 'MEDIUM' }} />
      </Card>
    </div>
  );
}
