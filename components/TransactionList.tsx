
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  isDarkMode: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, isDarkMode }) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={`rounded-3xl shadow-sm border overflow-hidden flex flex-col h-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      <div className={`p-6 border-b flex justify-between items-center sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-50'}`}>
        <h3 className="text-lg font-bold">Recent Activity</h3>
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${isDarkMode ? 'text-indigo-400 bg-indigo-950/30' : 'text-indigo-600 bg-indigo-50'}`}>
          {transactions.length} Records
        </span>
      </div>
      <div className="overflow-y-auto flex-1 max-h-[600px] scrollbar-hide">
        {sortedTransactions.length === 0 ? (
          <div className="p-16 text-center text-slate-300 dark:text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium">Start your zen journey by adding a record.</p>
          </div>
        ) : (
          <ul className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-50'}`}>
            {sortedTransactions.map((t) => (
              <li key={t.id} className={`p-5 transition-colors group ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-colors ${
                      t.type === TransactionType.INCOME 
                        ? (isDarkMode ? 'bg-emerald-900/20 text-emerald-400' : 'bg-emerald-50 text-emerald-500') 
                        : (isDarkMode ? 'bg-rose-900/20 text-rose-400' : 'bg-rose-50 text-rose-500')
                    }`}>
                      {t.type === TransactionType.INCOME ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-bold leading-none mb-1">
                        {t.subCategory || t.category}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.date} • {t.note || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <p className={`font-black text-right ${
                      t.type === TransactionType.INCOME ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
