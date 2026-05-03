import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard.jsx';

const COLUMN_COLORS = {
  NEW: 'bg-slate-100 text-slate-600',
  CONTACTED: 'bg-blue-100 text-blue-700',
  QUALIFIED: 'bg-indigo-100 text-indigo-700',
  PROPOSAL: 'bg-purple-100 text-purple-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
};

const COLUMN_LABELS = {
  NEW: 'New', CONTACTED: 'Contacted', QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal', WON: 'Won', LOST: 'Lost',
};

export default function KanbanColumn({ status, leads, onEdit }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${COLUMN_COLORS[status]}`}>
          {COLUMN_LABELS[status]}
        </span>
        <span className="text-xs text-slate-400 font-medium">{leads.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-24 rounded-xl p-2 space-y-2.5 transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'bg-slate-100/60'
        }`}
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => <KanbanCard key={lead.id} lead={lead} onEdit={onEdit} />)}
        </SortableContext>
      </div>
    </div>
  );
}
