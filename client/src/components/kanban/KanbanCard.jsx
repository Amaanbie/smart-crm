import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Building2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const fmt = (n) => n != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : null;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

export function KanbanCardDisplay({ lead }) {
  const isOverdue = lead.expectedCloseDate && new Date(lead.expectedCloseDate) < new Date() && !['WON','LOST'].includes(lead.status);
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-grab active:cursor-grabbing group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {lead.name}
        </span>
        <Badge value={lead.priority} className="shrink-0" />
      </div>

      {lead.company && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
          <Building2 size={11} />
          {lead.company}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        {fmt(lead.estimatedValue) ? (
          <span className="text-xs font-semibold text-slate-700">{fmt(lead.estimatedValue)}</span>
        ) : <span />}
        {fmtDate(lead.expectedCloseDate) && (
          <span className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
            <Calendar size={10} />
            {fmtDate(lead.expectedCloseDate)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function KanbanCard({ lead, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // PointerSensor activationConstraint distance:8 means a quick click without movement
  // does NOT activate the drag — so onClick fires normally on tap, and drag fires on hold+move.
  const handleClick = (e) => {
    if (isDragging) return;
    onEdit?.(lead);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDragging) {
          e.preventDefault();
          onEdit?.(lead);
        }
      }}
      aria-label={`Edit lead ${lead.name}`}
    >
      <KanbanCardDisplay lead={lead} />
    </div>
  );
}
