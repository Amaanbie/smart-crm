import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import Select from '../ui/Select.jsx';

const STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'PROPOSAL', label: 'Proposal' },
  { value: 'WON', label: 'Won' },
  { value: 'LOST', label: 'Lost' },
];

const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export default function LeadFilters({ filters, onChange }) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const t = setTimeout(() => onChange({ ...filters, search: searchInput, page: 1 }), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const set = (key, val) => onChange({ ...filters, [key]: val || undefined, page: 1 });

  const hasFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-48">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search name, company, email…"
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Select
        options={STATUS_OPTIONS}
        placeholder="All statuses"
        value={filters.status || ''}
        onChange={(e) => set('status', e.target.value)}
        className="w-40"
      />

      <Select
        options={PRIORITY_OPTIONS}
        placeholder="All priorities"
        value={filters.priority || ''}
        onChange={(e) => set('priority', e.target.value)}
        className="w-40"
      />

      {hasFilters && (
        <button
          onClick={() => { setSearchInput(''); onChange({ page: 1 }); }}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 px-2 py-2"
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}
