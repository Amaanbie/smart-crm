import { Phone, Mail, Users, FileText, Bell, CheckCircle, Circle, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const TYPE_ICONS = {
  CALL: Phone, EMAIL: Mail, MEETING: Users, NOTE: FileText, FOLLOW_UP: Bell,
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function ActivityTimeline({ activities, onToggle, onDelete }) {
  if (activities.length === 0) {
    return <p className="text-sm text-slate-400 py-4">No activities yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {activities.map((a) => {
        const Icon = TYPE_ICONS[a.type] || Bell;
        const isOverdue = a.dueDate && !a.completed && new Date(a.dueDate) < new Date();
        return (
          <li key={a.id} className={`flex gap-3 p-3 rounded-lg border transition ${a.completed ? 'bg-slate-50 border-slate-100 opacity-70' : isOverdue ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div className={`p-2 rounded-lg shrink-0 ${a.completed ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
              <Icon size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`text-sm font-medium ${a.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>{a.title}</p>
                  {a.description && <p className="text-xs text-slate-500 mt-0.5">{a.description}</p>}
                </div>
                <Badge value={a.type} className="shrink-0" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${isOverdue && !a.completed ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                  {a.dueDate ? `Due ${fmtDate(a.dueDate)}` : `Created ${fmtDate(a.createdAt)}`}
                  {isOverdue && !a.completed ? ' · Overdue' : ''}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggle(a.id, !a.completed)}
                    aria-label={a.completed ? 'Mark incomplete' : 'Mark complete'}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-green-600 transition"
                  >
                    {a.completed ? <CheckCircle size={15} className="text-green-500" /> : <Circle size={15} />}
                  </button>
                  <button
                    onClick={() => onDelete(a.id)}
                    aria-label="Delete activity"
                    className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
