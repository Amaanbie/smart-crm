import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function OverdueFollowUpsList({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400 py-4">
        <AlertCircle size={16} />
        No overdue follow-ups
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {item.lead?.name}{item.lead?.company ? ` · ${item.lead.company}` : ''} · Due {timeAgo(item.dueDate)}
            </p>
          </div>
          <Link to={`/leads/${item.lead?.id}`} className="text-blue-600 hover:text-blue-700 shrink-0">
            <ArrowRight size={16} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
