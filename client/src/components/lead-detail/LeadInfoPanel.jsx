import { Building2, Mail, Phone, User, DollarSign, Calendar, Tag, Layers } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const fmt = (n) => n != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n) : '—';
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <Icon size={15} className="text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-800 mt-0.5 break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function LeadInfoPanel({ lead }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <Badge value={lead.status} />
        <Badge value={lead.priority} />
      </div>

      <InfoRow icon={Building2} label="Company" value={lead.company} />
      <InfoRow icon={Mail} label="Email" value={lead.email} />
      <InfoRow icon={Phone} label="Phone" value={lead.phone} />
      <InfoRow icon={Tag} label="Source" value={lead.source?.replace('_', ' ')} />
      <InfoRow icon={DollarSign} label="Estimated Value" value={fmt(lead.estimatedValue)} />
      <InfoRow icon={Calendar} label="Expected Close" value={fmtDate(lead.expectedCloseDate)} />
      <InfoRow icon={User} label="Assigned To" value={lead.assignedTo?.name} />
      <InfoRow icon={Layers} label="Created By" value={lead.createdBy?.name} />
      <InfoRow icon={Calendar} label="Created At" value={fmtDate(lead.createdAt)} />
    </div>
  );
}
