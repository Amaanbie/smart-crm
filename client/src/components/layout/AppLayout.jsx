import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/pipeline': 'Kanban Pipeline',
  '/activities': 'Activities & Follow-ups',
  '/settings': 'Settings',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ||
    (pathname.startsWith('/leads/') ? 'Lead Details' : 'SmartCRM');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
