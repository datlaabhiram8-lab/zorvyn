import { Sun, Moon, Shield, Eye, Bell, Palette, Database, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

function SettingRow({ icon, title, desc, control }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.1rem 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--accent-dim)', color: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
        </div>
      </div>
      <div>{control}</div>
    </div>
  );
}

function Toggle({ on, onToggle, id }) {
  return (
    <button
      id={id}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      style={{
        width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: on ? 'var(--accent)' : 'var(--surface2)',
        position: 'relative', transition: 'background 0.25s', flexShrink: 0,
        boxShadow: on ? '0 0 10px rgba(99,102,241,0.4)' : 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.25s', display: 'block',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </button>
  );
}

export default function Settings() {
  const { state, dispatch, addToast } = useApp();
  const { theme, role } = state;

  const handleReset = () => {
    localStorage.removeItem('financego_state');
    addToast('All data reset. Refresh to apply.', 'info');
  };

  return (
    <>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="section-title">Settings</div>
          <div className="section-sub">Manage app preferences and account</div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title" style={{ marginBottom: '0.25rem' }}>
          <Palette size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Appearance
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          Customize how FinanceGo looks
        </div>

        <SettingRow
          icon={theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
          title="Dark Mode"
          desc="Toggle between dark and light theme"
          control={
            <Toggle
              id="toggle-dark-mode"
              on={theme === 'dark'}
              onToggle={() => dispatch({ type: 'TOGGLE_THEME' })}
            />
          }
        />
      </div>

      {/* Access Control */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title" style={{ marginBottom: '0.25rem' }}>
          <Shield size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Access Control
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          Switch between Admin and Viewer roles
        </div>

        <SettingRow
          icon={<Shield size={17} />}
          title="Admin Mode"
          desc="Admins can add, edit, and delete transactions. Viewers have read-only access."
          control={
            <Toggle
              id="toggle-admin-mode"
              on={role === 'admin'}
              onToggle={() => dispatch({ type: 'SET_ROLE', payload: role === 'admin' ? 'viewer' : 'admin' })}
            />
          }
        />
      </div>

      {/* Data */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="section-title" style={{ marginBottom: '0.25rem' }}>
          <Database size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Data Management
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          Manage your saved data
        </div>

        <SettingRow
          icon={<Database size={17} />}
          title="Reset All Data"
          desc="Clear localStorage and restore original demo transactions"
          control={
            <button className="btn btn-danger btn-sm" onClick={handleReset} id="btn-reset-data">
              Reset Data
            </button>
          }
        />
      </div>

      {/* About */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: '0.25rem' }}>
          <Info size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
          About FinanceGo
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text)' }}>FinanceGo — Personal Finance Dashboard</strong> — v1.0.0<br />
          Built with React 19 · Vite · Recharts · Lucide · date-fns<br /><br />
          A portfolio-grade personal finance dashboard featuring real-time charts,
          role-based access control, transaction management, and smart financial insights.
        </div>
      </div>
    </>
  );
}
