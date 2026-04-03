import { useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastList from './components/ToastList';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import './index.css';

function AppShell() {
  const { state, filteredTransactions } = useApp();
  const { activePage, isLoggedIn } = state;

  const exportCSV = useCallback(() => {
    const rows = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...filteredTransactions.map(t => [t.date, t.description, t.category, t.type, t.amount]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financego-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredTransactions]);

  const pages = {
    dashboard:    <Dashboard />,
    transactions: <Transactions />,
    insights:     <Insights />,
    settings:     <Settings />,
  };

  if (!isLoggedIn) return <LoginPage />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar onExport={exportCSV} />
        <div className="page-wrapper fade-in" key={activePage}>
          {pages[activePage] ?? <Dashboard />}
        </div>
      </div>
      <ToastList />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
