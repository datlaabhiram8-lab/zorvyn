import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmt, getMonthComparison } from '../data/mockData';

function StatCard({ label, value, type, icon: Icon, change, changeDir }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className={`stat-icon ${type}`}>
        <Icon size={18} />
      </div>
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${type}`}>{value}</div>
      {change !== undefined && (
        <div className="stat-change">
          {changeDir === 'up'
            ? <span className="up"><ArrowUp size={12} /> {Math.abs(change)}%</span>
            : <span className="down"><ArrowDown size={12} /> {Math.abs(change)}%</span>
          }
          <span>vs last month</span>
        </div>
      )}
    </div>
  );
}

export default function StatCards() {
  const { state } = useApp();
  const txs = state.transactions;

  const { totalIncome, totalExpense, balance, cmp } = useMemo(() => {
    const income  = txs.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      totalIncome:  income,
      totalExpense: expense,
      balance:      income - expense,
      cmp:          getMonthComparison(txs),
    };
  }, [txs]);

  const expChangePct = cmp.lastMonth > 0
    ? (((cmp.thisMonth - cmp.lastMonth) / cmp.lastMonth) * 100).toFixed(1)
    : 0;

  return (
    <div className="stats-grid">
      <StatCard
        label="Total Balance"
        value={fmt(balance)}
        type="balance"
        icon={Wallet}
      />
      <StatCard
        label="Total Income"
        value={fmt(totalIncome)}
        type="income"
        icon={TrendingUp}
      />
      <StatCard
        label="Total Expenses"
        value={fmt(totalExpense)}
        type="expense"
        icon={TrendingDown}
        change={Math.abs(expChangePct)}
        changeDir={expChangePct >= 0 ? 'up' : 'down'}
      />
    </div>
  );
}
