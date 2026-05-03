import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import { User, Shield, Mail, Calendar } from 'lucide-react';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Your account information</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{user?.name}</h3>
            <Badge value={user?.role} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 py-3 border-b border-slate-100">
            <Mail size={16} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Email</p>
              <p className="text-sm text-slate-800 mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3 border-b border-slate-100">
            <Shield size={16} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Role</p>
              <p className="text-sm text-slate-800 mt-0.5">{user?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Calendar size={16} className="text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Member Since</p>
              <p className="text-sm text-slate-800 mt-0.5">{fmtDate(user?.createdAt)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Application Info</h3>
        <div className="space-y-1 text-sm text-slate-500">
          <p>SmartCRM v1.0.0</p>
          <p>PERN Stack: PostgreSQL · Express · React · Node.js</p>
          <p>Built for lead & sales pipeline management</p>
        </div>
      </Card>
    </div>
  );
}
