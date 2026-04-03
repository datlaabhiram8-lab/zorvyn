import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  Settings, Shield, LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb       },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { role, activePage, sidebarOpen } = state;

  const navigate = (page) => dispatch({ type: 'SET_PAGE', payload: page });
  const closeOverlay = () => dispatch({ type: 'CLOSE_SIDEBAR' });

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeOverlay}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">💎</div>
          <span>FinanceGo</span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activePage === id ? 'active' : ''}`}
              onClick={() => navigate(id)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}

          <div className="sidebar-divider" />

          <button
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => navigate('settings')}
          >
            <Settings size={17} />
            Settings
          </button>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* Admin name if logged in as admin */}
          {role === 'admin' && localStorage.getItem('financego_admin_name') && (
            <div className="role-badge" style={{ marginBottom: '0.5rem' }}>
              <div className="role-dot admin" />
              <Shield size={13} style={{ opacity: 0.6 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {localStorage.getItem('financego_admin_name')}
              </span>
            </div>
          )}

          {/* Role badge — read-only indicator */}
          <div className="role-badge">
            <div className={`role-dot ${role === 'admin' ? 'admin' : ''}`} />
            <Shield size={13} style={{ opacity: 0.6 }} />
            Logged in as <strong style={{ color: 'var(--text)', marginLeft: 2 }}>{role === 'admin' ? 'Admin' : 'Viewer'}</strong>
          </div>

          {/* Sign out */}
          <button
            id="btn-logout"
            className="logout-btn"
            onClick={() => dispatch({ type: 'LOGOUT' })}
            style={{ marginTop: '0.65rem' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
