import { Sun, Moon, Download, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const PAGE_META = {
  dashboard:    { title: 'Dashboard',    sub: 'Your financial overview at a glance' },
  transactions: { title: 'Transactions', sub: 'Manage and filter your transaction history' },
  insights:     { title: 'Insights',     sub: 'Smart analysis of your spending habits' },
  settings:     { title: 'Settings',     sub: 'Preferences and account configuration' },
};

export default function Topbar({ onExport }) {
  const { state, dispatch } = useApp();
  const { theme, activePage } = state;
  const meta = PAGE_META[activePage] || PAGE_META.dashboard;

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger (mobile) */}
        <button
          className="topbar-btn hamburger"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="page-title">{meta.title}</div>
          <div className="page-subtitle">{format(new Date(), 'EEEE, MMM d yyyy')} · {meta.sub}</div>
        </div>
      </div>

      <div className="topbar-right">
        {/* Export CSV */}
        {activePage === 'transactions' && (
          <button className="topbar-btn" onClick={onExport} title="Export CSV">
            <Download size={17} />
          </button>
        )}

        {/* Theme toggle */}
        <button
          className="topbar-btn"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
