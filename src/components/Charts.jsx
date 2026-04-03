import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { generateBalanceHistory, generateCategoryData, fmt } from '../data/mockData';

const COLORS = ['#6366f1','#22c55e','#f59e0b','#f43f5e','#0ea5e9','#a855f7','#14b8a6','#f97316','#ec4899','#84cc16'];

// ── Custom Tooltip ────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.6rem 0.9rem', fontSize: '0.8rem',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, fontWeight: 700 }}>
          {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

function CatTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: 'var(--surface2)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '0.6rem 0.9rem', fontSize: '0.8rem',
    }}>
      <div style={{ fontWeight: 700, color: d.payload.fill }}>{d.name}</div>
      <div style={{ color: 'var(--text)', marginTop: 2 }}>{fmt(d.value)}</div>
    </div>
  );
}

// ── Balance Over Time ─────────────────────────────────────────────
export function BalanceChart() {
  const { state } = useApp();
  const data = useMemo(() => generateBalanceHistory(state.transactions), [state.transactions]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5}
          fill="url(#balGrad)" dot={false} activeDot={{ r: 5, fill: '#6366f1' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Category Donut ────────────────────────────────────────────────
export function CategoryPie() {
  const { state } = useApp();
  const data = useMemo(() => generateCategoryData(state.transactions), [state.transactions]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
          dataKey="value" nameKey="name" paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CatTooltip />} />
        <Legend
          formatter={(v) => <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{v}</span>}
          wrapperStyle={{ fontSize: '0.75rem' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Category Bar (for Insights) ───────────────────────────────────
export function CategoryBar() {
  const { state } = useApp();
  const data = useMemo(() => generateCategoryData(state.transactions).slice(0, 7), [state.transactions]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
          width={48}
        />
        <Tooltip content={<CatTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
