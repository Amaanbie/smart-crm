import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const fmt = (n) => n != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : '—';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

export default function LeadTable({ leads, onDelete }) {
  const navigate = useNavigate();

  if (leads.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">No leads found matching your criteria.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {['Name / Company', 'Status', 'Priority', 'Value', 'Close Date', 'Assigned To', ''].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => navigate(`/leads/${lead.id}`)}
              className="hover:bg-slate-50 cursor-pointer transition group"
            >
              <td className="py-3 px-4">
                <p className="font-medium text-slate-900 group-hover:text-blue-600">{lead.name}</p>
                <p className="text-xs text-slate-500">{lead.company || '—'}</p>
              </td>
              <td className="py-3 px-4"><Badge value={lead.status} /></td>
              <td className="py-3 px-4"><Badge value={lead.priority} /></td>
              <td className="py-3 px-4 font-medium text-slate-700">{fmt(lead.estimatedValue)}</td>
              <td className="py-3 px-4 text-slate-500">{fmtDate(lead.expectedCloseDate)}</td>
              <td className="py-3 px-4 text-slate-500">{lead.assignedTo?.name || '—'}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/leads/${lead.id}/edit`)}
                    aria-label="Edit lead"
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    aria-label="Delete lead"
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
