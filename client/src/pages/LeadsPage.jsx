import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useLeads } from '../hooks/useLeads.js';
import LeadFilters from '../components/leads/LeadFilters.jsx';
import LeadTable from '../components/leads/LeadTable.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export default function LeadsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
  const { data, total, loading, deleteLead } = useLeads(stableFilters);

  const handleDelete = async (id) => {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await deleteLead(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Leads</h2>
          <p className="text-sm text-slate-500 mt-0.5">{total} total leads</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>
          <Plus size={16} />
          Add Lead
        </Button>
      </div>

      <Card padding={false}>
        <div className="p-4 border-b border-slate-200">
          <LeadFilters filters={filters} onChange={setFilters} />
        </div>

        {loading ? (
          <PageSpinner />
        ) : data.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No leads found"
            description="Try adjusting your filters or add a new lead."
            action={<Button onClick={() => navigate('/leads/new')}><Plus size={16} />Add Lead</Button>}
          />
        ) : (
          <LeadTable leads={data} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  );
}
