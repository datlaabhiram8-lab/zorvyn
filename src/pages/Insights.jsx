import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Lightbulb, ShoppingBag, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCategoryData, getMonthComparison, fmt } from '../data/mockData';
import { CategoryBar } from '../components/Charts';

function InsightCard({ icon, color, colorDim, label, value, desc, bar, barFill }) {
  return (
    <div className="insight-card">
      <div className="insight-icon" style={{ background: colorDim, color }}>
        {icon}
      </div>
      <div className="insight-label">{label}</div>
      <div className="insight-value" style={{ color }}>{value}</div>
      <div className="insight-desc">{desc}</div>
      {bar !== undefined && (
        <>
          <div className="comparison-bar">
            <div className="fill" style={{ width: `${Math.min(bar, 100)}%`, background: color }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {bar.toFixed(0)}% of last month's spending
          </div>
        </>
      )}
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();
  const txs = state.transactions;

  const stats = useMemo(() => {
    const income  = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const cats    = generateCategoryData(txs);
    const cmp     = getMonthComparison(txs);
    const savingsRate = income > 0 ? (((income - expense) / income) * 100) : 0;
    const topCat  = cats[0] ?? { name: '—', value: 0 };
    const barPct  = cmp.lastMonth > 0 ? (cmp.thisMonth / cmp.lastMonth) * 100 : 0;
    return { income, expense, savingsRate, topCat, cmp, barPct, cats };
  }, [txs]);

  return (
    <>
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="section-title">Financial Insights</div>
          <div className="section-sub">Smart analysis based on your transaction history</div>
        </div>
      </div>

      {/* Insight Cards */}
      <div className="insights-grid">
        <InsightCard
          icon={<TrendingUp size={20} />}
          color="var(--green)" colorDim="var(--green-dim)"
          label="Savings Rate"
          value={`${stats.savingsRate.toFixed(1)}%`}
          desc={stats.savingsRate >= 20
            ? '🎉 Great job! You\'re saving over 20% of your income.'
            : '💡 Try to save at least 20% of your income each month.'}
        />

        <InsightCard
          icon={<ShoppingBag size={20} />}
          color="var(--amber)" colorDim="var(--amber-dim)"
          label="Top Expense Category"
          value={stats.topCat.name}
          desc={`Total spent: ${fmt(stats.topCat.value)} — your biggest spending area.`}
        />

        <InsightCard
          icon={<TrendingDown size={20} />}
          color={Number(stats.cmp.diff) > 0 ? 'var(--red)' : 'var(--green)'}
          colorDim={Number(stats.cmp.diff) > 0 ? 'var(--red-dim)' : 'var(--green-dim)'}
          label="Monthly Expense Change"
          value={`${Number(stats.cmp.diff) > 0 ? '+' : ''}${stats.cmp.diff}%`}
          desc={`This month: ${fmt(stats.cmp.thisMonth)} vs last month: ${fmt(stats.cmp.lastMonth)}`}
          bar={stats.barPct}
        />

        <InsightCard
          icon={<Lightbulb size={20} />}
          color="var(--accent-light)" colorDim="var(--accent-dim)"
          label="Income vs Expense"
          value={fmt(stats.income - stats.expense)}
          desc={`Total income: ${fmt(stats.income)} · Total expenses: ${fmt(stats.expense)}`}
        />

        {stats.savingsRate < 10 && (
          <InsightCard
            icon={<AlertCircle size={20} />}
            color="var(--red)" colorDim="var(--red-dim)"
            label="Low Savings Alert"
            value="⚠️ Action Needed"
            desc="Your savings rate is below 10%. Review non-essential spending to improve your financial health."
          />
        )}
      </div>

      {/* Category Bar Chart */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <div>
            <div className="section-title">Expense by Category</div>
            <div className="section-sub">Top 7 spending categories</div>
          </div>
        </div>
        <CategoryBar />
      </div>

      {/* Category Breakdown Table */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <div className="section-title">Full Category Breakdown</div>
        </div>
        <div className="table-wrap" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Amount Spent</th>
                <th style={{ textAlign: 'right' }}>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.cats.map((c, i) => {
                const pct = stats.expense > 0 ? ((c.value / stats.expense) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={c.name}>
                    <td>
                      <span className={`tx-cat cat-${c.name.toLowerCase()}`}>{c.name}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--red)' }}>{fmt(c.value)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
