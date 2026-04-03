import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

// ─── Initial State ───────────────────────────────────────────────────────────
const getInitialState = () => {
  try {
    const saved = localStorage.getItem('financego_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        transactions: parsed.transactions || INITIAL_TRANSACTIONS,
        role: parsed.role || 'admin',
        theme: parsed.theme || 'dark',
        filters: { search: '', category: 'all', type: 'all', sortBy: 'date', sortDir: 'desc' },
        toasts: [],
        sidebarOpen: false,
        activePage: 'dashboard',
        isLoggedIn: false,
      };
    }
  } catch {}
  return {
    transactions: INITIAL_TRANSACTIONS,
    role: 'admin',
    theme: 'dark',
    filters: { search: '', category: 'all', type: 'all', sortBy: 'date', sortDir: 'desc' },
    toasts: [],
    sidebarOpen: false,
    activePage: 'dashboard',
    isLoggedIn: false,
  };
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: { search: '', category: 'all', type: 'all', sortBy: 'date', sortDir: 'desc' } };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };
    case 'SET_PAGE':
      return { ...state, activePage: action.payload, sidebarOpen: false };
    case 'LOGIN':
      return { ...state, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, activePage: 'dashboard', sidebarOpen: false };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  // Sync theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Persist to localStorage (skip transient state)
  useEffect(() => {
    const { toasts, sidebarOpen, filters, activePage, isLoggedIn, ...persist } = state;
    localStorage.setItem('financego_state', JSON.stringify(persist));
  }, [state]);

  // Toast helper
  const addToast = useCallback((message, variant = 'info') => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, variant } });
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), 3500);
  }, []);

  // Derived: filtered & sorted transactions
  const { search, category, type, sortBy, sortDir } = state.filters;
  const filteredTransactions = state.transactions
    .filter(t => {
      const matchSearch =
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      const matchCat  = category === 'all' || t.category === category;
      const matchType = type === 'all' || t.type === type;
      return matchSearch && matchCat && matchType;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date')   cmp = new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') cmp = b.amount - a.amount;
      return sortDir === 'asc' ? -cmp : cmp;
    });

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
