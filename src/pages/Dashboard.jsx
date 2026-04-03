import { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fmt } from '../data/mockData';
import StatCards from '../components/StatCards';
import { BalanceChart, CategoryPie } from '../components/Charts';
import TransactionModal from '../components/TransactionModal';

function RecentRow({ tx }) {
  const catClass = `tx-cat cat-${tx.category.toLowerCase()}`;
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{tx.description}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{tx.date}</div>
      </td>
      <td><span className={catClass}>{tx.category}</span></td>
      <td>
        <div className="flex items-center" style={{ gap: '0.35rem' }}>
          {tx.type === 'income'
            ? <TrendingUp size={13} style={{ color: 'var(--green)' }} />
            : <TrendingDown size={13} style={{ color: 'var(--red)' }} />
          }
          <span className={`tx-amount ${tx.type}`}>{fmt(tx.amount)}</span>
        </div>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const recent = useMemo(() =>
    [...state.transactions].slice(0, 5),
    [state.transactions]
  );

  return (
    <>
      {/* Stats */}
      <StatCards />

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <div className="section-title">Balance History</div>
              <div className="section-sub">Last 30 days</div>
            </div>
          </div>
          <BalanceChart />
        </div>

        <div className="card">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <div className="section-title">Spending Breakdown</div>
              <div className="section-sub">By category</div>
            </div>
          </div>
          <CategoryPie />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Recent Transactions</div>
            <div className="section-sub">Your latest 5 activities</div>
          </div>
          {state.role === 'admin' && (
            <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Add
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💸</div>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to get started</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => <RecentRow key={tx.id} tx={tx} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
