// ─── Mock Data ───────────────────────────────────────────────────────────────
import { subDays, format, startOfMonth, subMonths } from 'date-fns';

const today = new Date();

// Generate realistic transactions over the last 60 days
const RAW = [
  // April (current month)
  { id: 't001', date: format(subDays(today, 1),  'yyyy-MM-dd'), description: 'Monthly Salary',       category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 't002', date: format(subDays(today, 1),  'yyyy-MM-dd'), description: 'Grocery Run',          category: 'Food',          type: 'expense', amount: 3200  },
  { id: 't003', date: format(subDays(today, 2),  'yyyy-MM-dd'), description: 'Uber Ride',            category: 'Transport',     type: 'expense', amount: 420   },
  { id: 't004', date: format(subDays(today, 2),  'yyyy-MM-dd'), description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 649   },
  { id: 't005', date: format(subDays(today, 3),  'yyyy-MM-dd'), description: 'Freelance Project',    category: 'Freelance',     type: 'income',  amount: 22000 },
  { id: 't006', date: format(subDays(today, 4),  'yyyy-MM-dd'), description: 'Electricity Bill',     category: 'Utilities',     type: 'expense', amount: 1850  },
  { id: 't007', date: format(subDays(today, 4),  'yyyy-MM-dd'), description: 'Swiggy — Dinner',      category: 'Food',          type: 'expense', amount: 890   },
  { id: 't008', date: format(subDays(today, 5),  'yyyy-MM-dd'), description: 'Amazon Shopping',      category: 'Shopping',      type: 'expense', amount: 4200  },
  { id: 't009', date: format(subDays(today, 6),  'yyyy-MM-dd'), description: 'Mutual Fund SIP',      category: 'Investment',    type: 'expense', amount: 10000 },
  { id: 't010', date: format(subDays(today, 7),  'yyyy-MM-dd'), description: 'House Rent',           category: 'Housing',       type: 'expense', amount: 18000 },
  { id: 't011', date: format(subDays(today, 7),  'yyyy-MM-dd'), description: 'Zomato — Lunch',       category: 'Food',          type: 'expense', amount: 650   },
  { id: 't012', date: format(subDays(today, 8),  'yyyy-MM-dd'), description: 'Metro Card Recharge',  category: 'Transport',     type: 'expense', amount: 500   },
  { id: 't013', date: format(subDays(today, 9),  'yyyy-MM-dd'), description: 'Gym Membership',       category: 'Health',        type: 'expense', amount: 2500  },
  { id: 't014', date: format(subDays(today, 10), 'yyyy-MM-dd'), description: 'Freelance Design Work', category: 'Freelance',    type: 'income',  amount: 15000 },
  { id: 't015', date: format(subDays(today, 10), 'yyyy-MM-dd'), description: 'Pharmacy',             category: 'Health',        type: 'expense', amount: 780   },
  // Last month
  { id: 't016', date: format(subDays(today, 32), 'yyyy-MM-dd'), description: 'Monthly Salary',       category: 'Salary',        type: 'income',  amount: 85000 },
  { id: 't017', date: format(subDays(today, 33), 'yyyy-MM-dd'), description: 'House Rent',           category: 'Housing',       type: 'expense', amount: 18000 },
  { id: 't018', date: format(subDays(today, 33), 'yyyy-MM-dd'), description: 'Grocery Store',        category: 'Food',          type: 'expense', amount: 2800  },
  { id: 't019', date: format(subDays(today, 34), 'yyyy-MM-dd'), description: 'Petrol Fill-up',       category: 'Transport',     type: 'expense', amount: 3500  },
  { id: 't020', date: format(subDays(today, 35), 'yyyy-MM-dd'), description: 'Movie Tickets',        category: 'Entertainment', type: 'expense', amount: 1200  },
  { id: 't021', date: format(subDays(today, 36), 'yyyy-MM-dd'), description: 'Internet Bill',        category: 'Utilities',     type: 'expense', amount: 999   },
  { id: 't022', date: format(subDays(today, 37), 'yyyy-MM-dd'), description: 'Mutual Fund SIP',      category: 'Investment',    type: 'expense', amount: 10000 },
  { id: 't023', date: format(subDays(today, 38), 'yyyy-MM-dd'), description: 'Online Course',        category: 'Shopping',      type: 'expense', amount: 2999  },
  { id: 't024', date: format(subDays(today, 40), 'yyyy-MM-dd'), description: 'Freelance Dev Work',   category: 'Freelance',     type: 'income',  amount: 30000 },
  { id: 't025', date: format(subDays(today, 41), 'yyyy-MM-dd'), description: 'Swiggy — Multiple',    category: 'Food',          type: 'expense', amount: 1500  },
  { id: 't026', date: format(subDays(today, 42), 'yyyy-MM-dd'), description: 'Dentist Visit',        category: 'Health',        type: 'expense', amount: 4000  },
  { id: 't027', date: format(subDays(today, 43), 'yyyy-MM-dd'), description: 'Stock Dividend',       category: 'Investment',    type: 'income',  amount: 3500  },
  { id: 't028', date: format(subDays(today, 50), 'yyyy-MM-dd'), description: 'Clothes Shopping',     category: 'Shopping',      type: 'expense', amount: 5600  },
  { id: 't029', date: format(subDays(today, 55), 'yyyy-MM-dd'), description: 'Spotify Premium',      category: 'Entertainment', type: 'expense', amount: 119   },
  { id: 't030', date: format(subDays(today, 58), 'yyyy-MM-dd'), description: 'Home Maintenance',     category: 'Housing',       type: 'expense', amount: 3200  },
];

export const INITIAL_TRANSACTIONS = RAW.sort((a, b) => new Date(b.date) - new Date(a.date));

export const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Health', 'Salary',
  'Entertainment', 'Utilities', 'Freelance', 'Investment', 'Shopping',
];

// Generate balance-over-time chart data (last 30 days)
export function generateBalanceHistory(transactions) {
  const days = 30;
  const data = [];
  let runningBalance = 42000; // starting baseline

  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const label = format(date, 'MMM d');
    const dayStr = format(date, 'yyyy-MM-dd');

    const dayTxs = transactions.filter(t => t.date === dayStr);
    dayTxs.forEach(t => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
    });

    data.push({ date: label, balance: Math.max(runningBalance, 0) });
  }
  return data;
}

// Expense breakdown by category
export function generateCategoryData(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const map = {};
  expenses.forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

// This month vs last month
export function getMonthComparison(transactions) {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd   = new Date(thisMonthStart.getTime() - 1);

  const thisMonth = transactions
    .filter(t => new Date(t.date) >= thisMonthStart && t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const lastMonth = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d >= lastMonthStart && d <= lastMonthEnd && t.type === 'expense';
    })
    .reduce((s, t) => s + t.amount, 0);

  const diff = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
  return { thisMonth, lastMonth, diff: diff.toFixed(1) };
}

export function fmt(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}
