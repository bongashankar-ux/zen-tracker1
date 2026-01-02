
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DateRange } from '../App';

interface DashboardProps {
  transactions: Transaction[];
  onAddClick: (type: TransactionType) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  isFiltered: boolean;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  onAddClick, 
  searchTerm, 
  onSearchChange, 
  isFiltered,
  dateRange,
  onDateRangeChange,
  isDarkMode
}) => {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Breakdown by Sub-Category for Expenses
  const categoryDataMap: Record<string, number> = {};
  transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .forEach(t => {
      const label = t.subCategory || t.category;
      categoryDataMap[label] = (categoryDataMap[label] || 0) + t.amount;
    });

  const pieData = Object.entries(categoryDataMap).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6'];

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleRangePreset = (label: string) => {
    const today = new Date();
    let start: string | null = null;
    let end: string | null = null;

    if (label === 'This Month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      start = firstDay.toISOString().split('T')[0];
    } else if (label === 'Last Month') {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      start = firstDayLastMonth.toISOString().split('T')[0];
      end = lastDayLastMonth.toISOString().split('T')[0];
    } else if (label === 'Last 7 Days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      start = sevenDaysAgo.toISOString().split('T')[0];
    } else if (label === 'All Time') {
      start = null;
      end = null;
    }

    setShowCustomRange(label === 'Custom');
    onDateRangeChange({ start, end, label });
  };

  const cardBase = `p-6 rounded-3xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`;

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className={`h-5 w-5 transition-colors ${isFiltered ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search categories, items or notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-12 pr-12 py-5 border-2 rounded-[2rem] outline-none transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' 
                : 'bg-white border-slate-100 text-slate-700 focus:border-indigo-500 focus:shadow-md'
            } ${isFiltered && !isDarkMode ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg' : ''} ${isFiltered && isDarkMode ? 'border-indigo-500 ring-4 ring-indigo-900/20' : ''}`}
          />
          {isFiltered && (
            <button 
              onClick={() => {
                onSearchChange('');
                handleRangePreset('All Time');
              }}
              className="absolute inset-y-0 right-4 flex items-center px-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Date Presets Pill Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {['All Time', 'This Month', 'Last Month', 'Last 7 Days', 'Custom'].map((label) => (
            <button
              key={label}
              onClick={() => handleRangePreset(label)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                dateRange.label === label 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : isDarkMode 
                    ? 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700 hover:text-slate-300'
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom Date Picker Section */}
        {showCustomRange && (
          <div className={`flex flex-wrap items-center gap-4 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'bg-slate-900 border-indigo-900/30' : 'bg-indigo-50/50 border-indigo-100'}`}>
            <div className="flex flex-col gap-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-400'}`}>From</label>
              <input 
                type="date" 
                value={dateRange.start || ''} 
                onChange={(e) => onDateRangeChange({...dateRange, start: e.target.value})}
                className={`px-3 py-2 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-indigo-200 text-slate-700'}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-400'}`}>To</label>
              <input 
                type="date" 
                value={dateRange.end || ''} 
                onChange={(e) => onDateRangeChange({...dateRange, end: e.target.value})}
                className={`px-3 py-2 border rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-indigo-200 text-slate-700'}`}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className={`${cardBase} flex flex-col justify-center ${isFiltered ? (isDarkMode ? 'border-indigo-900 bg-indigo-900/10' : 'border-indigo-100 bg-indigo-50/10') : ''}`}>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            {dateRange.label === 'All Time' ? 'Total Balance' : `${dateRange.label} Balance`}
          </p>
          <h2 className={`text-4xl font-black mt-2 ${balance >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
            ₹{formatCurrency(balance)}
          </h2>
        </div>

        {/* Income Card */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 relative group hover:shadow-md ${isDarkMode ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100 hover:shadow-emerald-100/50'}`}>
          <div className="flex justify-between items-start">
            <p className="text-emerald-600 dark:text-emerald-500 text-xs font-bold uppercase tracking-widest">
              {dateRange.label === 'All Time' ? 'Total Income' : `${dateRange.label} Income`}
            </p>
            <button 
              onClick={() => onAddClick(TransactionType.INCOME)}
              className="w-8 h-8 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 hover:scale-110 active:scale-95 transition-transform"
              title="Add Income"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <h2 className="text-3xl font-black mt-2 text-emerald-700 dark:text-emerald-400">
            +₹{formatCurrency(totalIncome)}
          </h2>
        </div>

        {/* Expense Card */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 relative group hover:shadow-md ${isDarkMode ? 'bg-rose-950/20 border-rose-900/30' : 'bg-rose-50 border-rose-100 hover:shadow-rose-100/50'}`}>
          <div className="flex justify-between items-start">
            <p className="text-rose-600 dark:text-rose-500 text-xs font-bold uppercase tracking-widest">
              {dateRange.label === 'All Time' ? 'Total Expenses' : `${dateRange.label} Expenses`}
            </p>
            <button 
              onClick={() => onAddClick(TransactionType.EXPENSE)}
              className="w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-rose-900/20 hover:scale-110 active:scale-95 transition-transform"
              title="Add Expense"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <h2 className="text-3xl font-black mt-2 text-rose-700 dark:text-rose-400">
            -₹{formatCurrency(totalExpenses)}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardBase} p-8`}>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Breakdown ({dateRange.label})
          </h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `₹${formatCurrency(value)}`}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      color: isDarkMode ? '#fff' : '#000'
                    }}
                    itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-700 font-medium text-center">
                No data for this range
              </div>
            )}
          </div>
        </div>

        <div className={`${cardBase} p-8`}>
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Trend Comparison
          </h3>
          <div className="h-64">
             {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactions.slice(-10).map(t => ({
                  name: t.date.slice(5),
                  val: t.type === TransactionType.EXPENSE ? -t.amount : t.amount,
                  type: t.type
                }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#f1f5f9"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: isDarkMode ? '#334155' : '#f8fafc'}}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                      color: isDarkMode ? '#fff' : '#000'
                    }}
                    formatter={(value: number) => `₹${formatCurrency(Math.abs(value))}`}
                  />
                  <Bar dataKey="val" radius={[6, 6, 6, 6]}>
                    {transactions.slice(-10).map((t, index) => (
                      <Cell key={`cell-${index}`} fill={t.type === TransactionType.INCOME ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-300 dark:text-slate-700 font-medium text-center px-10">
                Add transactions to see charts
              </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
