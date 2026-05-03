import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads } from '../api/leads.api.js';
import { getActivities } from '../api/activities.api.js';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';
import { Phone, Mail, Users, FileText, Bell, CheckCircle, Circle } from 'lucide-react';
import { updateActivity } from '../api/activities.api.js';

const TYPE_ICONS = { CALL: Phone, EMAIL: Mail, MEETING: Users, NOTE: FileText, FOLLOW_UP: Bell };
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

export default function ActivitiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      const { data: leads } = await getLeads({ limit: 200 });
      const all = (await Promise.all(leads.map((l) => getActivities(l.id).then((acts) => acts.map((a) => ({ ...a, lead: l })))))).flat();
      all.sort((a, b) => (a.dueDate || a.createdAt) > (b.dueDate || b.createdAt) ? 1 : -1);
      setItems(all);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const filtered = items.filter((a) => {
    if (filter === 'overdue') return !a.completed && a.dueDate && new Date(a.dueDate) < now;
    if (filter === 'pending') return !a.completed;
    if (filter === 'completed') return a.completed;
    return true;
  });

  const toggle = async (id, completed) => {
    await updateActivity(id, { completed });
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, completed } : a)));
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Activities & Follow-ups</h2>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {['all','pending','overdue','completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Card padding={false}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No activities found.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((a) => {
              const Icon = TYPE_ICONS[a.type] || Bell;
              const isOverdue = !a.completed && a.dueDate && new Date(a.dueDate) < now;
              return (
                <li key={a.id} className={`flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition ${isOverdue ? 'bg-red-50/40' : ''}`}>
                  <div className={`p-2 rounded-lg ${a.completed ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${a.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>{a.title}</p>
                    <Link to={`/leads/${a.lead.id}`} className="text-xs text-blue-600 hover:underline">
                      {a.lead.name}{a.lead.company ? ` · ${a.lead.company}` : ''}
                    </Link>
                  </div>
                  <Badge value={a.type} />
                  <span className={`text-xs whitespace-nowrap ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                    {fmtDate(a.dueDate)}{isOverdue ? ' · Overdue' : ''}
                  </span>
                  <button onClick={() => toggle(a.id, !a.completed)} aria-label="Toggle completion">
                    {a.completed ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} className="text-slate-300 hover:text-green-400 transition" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
