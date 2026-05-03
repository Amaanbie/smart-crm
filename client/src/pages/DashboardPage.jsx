import { Users, DollarSign, TrendingUp, Target, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard.js';
import KpiCard from '../components/dashboard/KpiCard.jsx';
import LeadsByStatusChart from '../components/dashboard/LeadsByStatusChart.jsx';
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart.jsx';
import OverdueFollowUpsList from '../components/dashboard/OverdueFollowUpsList.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);

export default function DashboardPage() {
  const { data, loading } = useDashboard();

  if (loading) return <PageSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Total Leads" value={data.totalLeads} sub="All pipeline stages" color="blue" />
        <KpiCard icon={DollarSign} label="Pipeline Value" value={fmt(data.totalPipelineValue)} sub="Total estimated" color="purple" />
        <KpiCard icon={TrendingUp} label="Won Revenue" value={fmt(data.wonRevenue)} sub="Closed & won deals" color="green" />
        <KpiCard icon={Target} label="Conversion Rate" value={`${data.conversionRate}%`} sub="Won vs closed" color="orange" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4">Leads by Status</h3>
          <LeadsByStatusChart data={data.leadsByStatus} />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4">Leads by Source</h3>
          <LeadsBySourceChart data={data.leadsBySource} />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Overdue Follow-ups
          </h3>
          <OverdueFollowUpsList items={data.overdueFollowUps} />
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            Hot Leads
          </h3>
          {data.highPriorityLeads.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No high priority leads right now.</p>
          ) : (
            <ul className="space-y-2">
              {data.highPriorityLeads.map((lead) => (
                <li key={lead.id}>
                  <Link
                    to={`/leads/${lead.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 truncate">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.company || '—'}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge value={lead.status} />
                      <span className="text-sm font-semibold text-slate-700">{fmt(lead.estimatedValue)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
