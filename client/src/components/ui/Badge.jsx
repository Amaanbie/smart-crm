const statusColors = {
  NEW: 'bg-slate-100 text-slate-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  QUALIFIED: 'bg-indigo-100 text-indigo-700',
  PROPOSAL: 'bg-purple-100 text-purple-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-slate-100 text-slate-600',
  CALL: 'bg-blue-100 text-blue-700',
  EMAIL: 'bg-indigo-100 text-indigo-700',
  MEETING: 'bg-purple-100 text-purple-700',
  NOTE: 'bg-slate-100 text-slate-700',
  FOLLOW_UP: 'bg-orange-100 text-orange-700',
};

const statusLabels = {
  NEW: 'New', CONTACTED: 'Contacted', QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal', WON: 'Won', LOST: 'Lost',
  HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low',
  CALL: 'Call', EMAIL: 'Email', MEETING: 'Meeting', NOTE: 'Note', FOLLOW_UP: 'Follow-up',
};

export default function Badge({ value, className = '' }) {
  const color = statusColors[value] || 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color} ${className}`}>
      {statusLabels[value] || value}
    </span>
  );
}
