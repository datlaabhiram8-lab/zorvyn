import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Eye, EyeOff, LogIn, User, CheckCircle, XCircle, Lock } from 'lucide-react';

// ── SHA-256 hash via Web Crypto API ───────────────────────────────
async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Password strength checker ─────────────────────────────────────
function getStrength(password) {
  const rules = [
    { label: 'At least 8 characters',        pass: password.length >= 8 },
    { label: 'Uppercase letter (A–Z)',         pass: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a–z)',         pass: /[a-z]/.test(password) },
    { label: 'Number (0–9)',                   pass: /[0-9]/.test(password) },
    { label: 'Special character (!@#$…)',      pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = rules.filter(r => r.pass).length;
  const level = score <= 2 ? 'weak' : score <= 3 ? 'fair' : score === 4 ? 'good' : 'strong';
  return { rules, score, level };
}

const STRENGTH_COLOR = {
  weak:   'var(--red)',
  fair:   'var(--amber)',
  good:   '#38bdf8',
  strong: 'var(--green)',
};
const STRENGTH_LABEL = {
  weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong',
};

// ── Setup Form (first-time) ───────────────────────────────────────
function SetupForm({ onSetup }) {
  const [name, setName]         = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const strength = getStrength(password);
  const allRulesPassed = strength.score === 5;
  const passwordsMatch = password === confirm && confirm.length > 0;

  const handleSetup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!allRulesPassed) {
      setError('Your password does not meet all requirements.');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const hashed = await hashPassword(password);
    localStorage.setItem('financego_admin_name', name.trim());
    localStorage.setItem('financego_admin_hash', hashed);
    setLoading(false);
    onSetup(name.trim());
  };

  return (
    <form onSubmit={handleSetup} className="login-form" noValidate>
      <div className="login-setup-badge">⚙️ First-time setup — create your Admin account</div>

      {/* Name */}
      <div className="form-group">
        <label className="form-label">Your Full Name</label>
        <input
          id="setup-name"
          className="form-input"
          placeholder="e.g. Abhiram Datla"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label">Create Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="setup-password"
            className="form-input"
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ paddingRight: '2.8rem' }}
          />
          <button type="button" onClick={() => setShowPw(s => !s)} className="pw-eye-btn" tabIndex={-1}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Strength meter */}
        {password.length > 0 && (
          <div style={{ marginTop: '0.6rem' }}>
            <div className="strength-bar-track">
              <div
                className="strength-bar-fill"
                style={{
                  width: `${(strength.score / 5) * 100}%`,
                  background: STRENGTH_COLOR[strength.level],
                }}
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: STRENGTH_COLOR[strength.level], fontWeight: 700, marginTop: 4 }}>
              {STRENGTH_LABEL[strength.level]}
            </div>
            <div className="strength-rules">
              {strength.rules.map(r => (
                <div key={r.label} className={`strength-rule ${r.pass ? 'pass' : 'fail'}`}>
                  {r.pass ? <CheckCircle size={11} /> : <XCircle size={11} />}
                  {r.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="form-group">
        <label className="form-label">Confirm Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="setup-confirm"
            className="form-input"
            type={showPw ? 'text' : 'password'}
            placeholder="Re-enter password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{
              paddingRight: '2.8rem',
              borderColor: confirm.length > 0
                ? (passwordsMatch ? 'var(--green)' : 'var(--red)')
                : undefined,
            }}
          />
          {confirm.length > 0 && (
            <span style={{
              position: 'absolute', right: '0.75rem', top: '50%',
              transform: 'translateY(-50%)',
              color: passwordsMatch ? 'var(--green)' : 'var(--red)',
              display: 'flex',
            }}>
              {passwordsMatch ? <CheckCircle size={15} /> : <XCircle size={15} />}
            </span>
          )}
        </div>
      </div>

      {error && <div className="login-error">{error}</div>}

      <button
        id="btn-create-account"
        type="submit"
        className="btn btn-primary w-full"
        style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.9rem' }}
        disabled={loading}
      >
        {loading ? <span className="login-spinner" /> : <><Lock size={15} /> Create Admin Account</>}
      </button>
    </form>
  );
}

// ── Login Form (returning) ────────────────────────────────────────
function AdminLoginForm({ adminName, onSuccess }) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked]     = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (!locked) return;
    let secs = 30;
    setLockTimer(secs);
    const interval = setInterval(() => {
      secs -= 1;
      setLockTimer(secs);
      if (secs <= 0) {
        setLocked(false);
        setAttempts(0);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [locked]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (locked) return;
    setError('');
    setLoading(true);
    const hashed = await hashPassword(password);
    const stored = localStorage.getItem('financego_admin_hash');
    setLoading(false);
    if (hashed === stored) {
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLocked(true);
        setError('Too many failed attempts. Locked for 30 seconds.');
      } else {
        setError(`Incorrect password. ${5 - newAttempts} attempt${5 - newAttempts !== 1 ? 's' : ''} remaining.`);
      }
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form" noValidate>
      <div className="login-welcome">
        <div className="login-avatar">{adminName.charAt(0).toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Welcome back,</div>
          <div style={{ color: 'var(--accent-light)', fontWeight: 800, fontSize: '1.1rem' }}>{adminName}</div>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label className="form-label">Password</label>
        <div style={{ position: 'relative' }}>
          <input
            id="login-password"
            className="form-input"
            type={showPw ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            style={{ paddingRight: '2.8rem' }}
            autoFocus
            disabled={locked}
          />
          <button type="button" onClick={() => setShowPw(s => !s)} className="pw-eye-btn" tabIndex={-1}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <div className={`login-error ${locked ? 'locked' : ''}`}>
          {locked && <Lock size={13} />} {error}
          {locked && <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Try again in {lockTimer}s</div>}
        </div>
      )}

      <button
        id="btn-admin-login"
        type="submit"
        className="btn btn-primary w-full"
        style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.9rem' }}
        disabled={loading || locked}
      >
        {loading ? <span className="login-spinner" /> : <><LogIn size={16} /> Sign In</>}
      </button>
    </form>
  );
}

// ── Main Login Page ───────────────────────────────────────────────
export default function LoginPage() {
  const { dispatch } = useApp();
  const [tab, setTab]             = useState('admin');
  const [loading, setLoading]     = useState(false);
  const [justSetup, setJustSetup] = useState(false);

  const storedName = localStorage.getItem('financego_admin_name');
  const hasAccount = !!localStorage.getItem('financego_admin_hash');

  const loginAs = (role) => {
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: 'SET_ROLE', payload: role });
      dispatch({ type: 'LOGIN' });
    }, 450);
  };

  const handleSetupDone = (name) => {
    setJustSetup(true);
  };

  return (
    <div className="login-bg">
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">💎</div>
          <div className="login-logo-text">FinanceGo</div>
        </div>
        <p className="login-subtitle">FinanceGo — Personal Finance Command Centre</p>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'admin' ? 'active' : ''}`}
            onClick={() => { setTab('admin'); }}
            id="tab-admin"
          >
            <Shield size={14} /> Admin
          </button>
          <button
            className={`login-tab ${tab === 'viewer' ? 'active' : ''}`}
            onClick={() => { setTab('viewer'); }}
            id="tab-viewer"
          >
            <User size={14} /> Viewer
          </button>
        </div>

        {/* Admin tab */}
        {tab === 'admin' && (
          <>
            {justSetup && (
              <div className="login-success-banner">
                ✅ Account created! Sign in with your new password.
              </div>
            )}
            {!hasAccount || justSetup
              ? !justSetup
                ? <SetupForm onSetup={handleSetupDone} />
                : <AdminLoginForm adminName={localStorage.getItem('financego_admin_name')} onSuccess={() => loginAs('admin')} />
              : <AdminLoginForm adminName={storedName} onSuccess={() => loginAs('admin')} />
            }
          </>
        )}

        {/* Viewer tab */}
        {tab === 'viewer' && (
          <div className="login-form">
            <div className="viewer-info">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👁</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>Read-Only Access</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Browse dashboards, charts and transaction history.<br />
                No edits or additions permitted.
              </div>
            </div>
            <button
              id="btn-viewer-login"
              className="btn btn-ghost w-full"
              style={{ justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
              onClick={() => loginAs('viewer')}
              disabled={loading}
            >
              {loading ? <span className="login-spinner" /> : <><User size={16} /> Continue as Viewer</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
