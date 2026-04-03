import { useState } from 'react';
import {
  Plus, Search, ChevronUp, ChevronDown,
  Pencil, Trash2, TrendingUp, TrendingDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, fmt } from '../data/mockData';
import TransactionModal from '../components/TransactionModal';

export default function Transactions() {
  const { state, dispatch, filteredTransactions, addToast } = useApp();
  const { role, filters } = state;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Helpers
  const setFilter = (key, val) => dispatch({ type: 'SET_FILTER', payload: { [key]: val } });
  const toggleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter('sortDir', filters.sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: col, sortDir: 'desc' } });
    }
  };

  const openAdd  = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditing(tx); setModalOpen(true); };
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    addToast('Transaction deleted', 'error');
  };

  const SortIcon = ({ col }) => {
    if (filters.sortBy !== col) return <ChevronDown size={12} className="sort-icon" />;
    return filters.sortDir === 'asc'
      ? <ChevronUp size={12} className="sort-icon" style={{ color: 'var(--accent-light)', opacity: 1 }} />
      : <ChevronDown size={12} className="sort-icon" style={{ color: 'var(--accent-light)', opacity: 1 }} />;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="section-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div className="section-title">All Transactions</div>
          <div className="section-sub">{filteredTransactions.length} record{filteredTransactions.length !== 1 ? 's' : ''} found</div>
        </div>
        {role === 'admin' && (
          <button className="btn btn-primary" onClick={openAdd} id="btn-add-transaction">
            <Plus size={15} /> Add Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={15} />
          <input
            className="search-input"
            placeholder="Search by description or category…"
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            id="tx-search"
          />
        </div>

        <select
          className="filter-select"
          value={filters.type}
          onChange={e => setFilter('type', e.target.value)}
          id="filter-type"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={e => setFilter('category', e.target.value)}
          id="filter-category"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {(filters.search || filters.type !== 'all' || filters.category !== 'all') && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="table-wrap" style={{ borderRadius: 16, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleSort('date')} className={filters.sortBy === 'date' ? 'sorted' : ''}>
                    Date <SortIcon col="date" />
                  </th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th onClick={() => toggleSort('amount')} className={filters.sortBy === 'amount' ? 'sorted' : ''} style={{ textAlign: 'right' }}>
                    Amount <SortIcon col="amount" />
                  </th>
                  {role === 'admin' && <th style={{ textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{tx.date}</td>
                    <td style={{ fontWeight: 600, fontSize: '0.88rem' }}>{tx.description}</td>
                    <td>
                      <span className={`tx-cat cat-${tx.category.toLowerCase()}`}>{tx.category}</span>
                    </td>
                    <td>
                      <span className={`tx-cat ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                        {tx.type === 'income'
                          ? <><TrendingUp size={11} /> Income</>
                          : <><TrendingDown size={11} /> Expense</>
                        }
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`tx-amount ${tx.type}`}>{fmt(tx.amount)}</span>
                    </td>
                    {role === 'admin' && (
                      <td>
                        <div className="tx-actions" style={{ justifyContent: 'center' }}>
                          <button className="action-btn" onClick={() => openEdit(tx)} title="Edit"><Pencil size={13} /></button>
                          <button className="action-btn del" onClick={() => handleDelete(tx.id)} title="Delete"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <TransactionModal editing={editing} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
