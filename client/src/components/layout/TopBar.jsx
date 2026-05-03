import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function TopBar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="min-h-20 py-4 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-slate-900 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
