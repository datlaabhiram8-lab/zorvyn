import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { format } from 'date-fns';

const EMPTY = {
  description: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export default function TransactionModal({ editing, onClose }) {
  const { dispatch, addToast } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editing) setForm({ ...editing, amount: String(editing.amount) });
    else setForm(EMPTY);
  }, [editing]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const tx = {
      ...form,
      amount: Number(form.amount),
      id: editing ? editing.id : `t${Date.now()}`,
    };
    if (editing) {
      dispatch({ type: 'EDIT_TRANSACTION', payload: tx });
      addToast('Transaction updated!', 'success');
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: tx });
      addToast('Transaction added!', 'success');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">
            {editing ? '✏️ Edit Transaction' : '➕ Add Transaction'}
          </h2>
          <button className="topbar-btn" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </div>

        <form onSubmit={submit}>
          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="e.g. Grocery Run"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <div style={{ color: 'var(--red)', fontSize:'0.76rem', marginTop: 4 }}>{errors.description}</div>}
          </div>

          <div className="form-row">
            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
              {errors.amount && <div style={{ color: 'var(--red)', fontSize:'0.76rem', marginTop: 4 }}>{errors.amount}</div>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
              {errors.date && <div style={{ color: 'var(--red)', fontSize:'0.76rem', marginTop: 4 }}>{errors.date}</div>}
            </div>
          </div>

          <div className="form-row">
            {/* Type */}
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editing ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
