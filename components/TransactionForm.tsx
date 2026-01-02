
import React, { useState, useEffect } from 'react';
import { TransactionType, Transaction } from '../types';
import { INCOME_CATEGORIES, EXPENSE_STRUCTURE } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Transaction) => void;
  onClose: () => void;
  initialType?: TransactionType;
  isDarkMode: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose, initialType, isDarkMode }) => {
  const [type, setType] = useState<TransactionType>(initialType || TransactionType.EXPENSE);
  const [amount, setAmount] = useState<string>('');
  
  // For Expenses
  const [mainCategory, setMainCategory] = useState<string>(Object.keys(EXPENSE_STRUCTURE)[0]);
  const [subCategory, setSubCategory] = useState<string>(EXPENSE_STRUCTURE['HOUSEHOLD & LIVING EXPENSES'][0]);
  
  // For Income
  const [incomeCategory, setIncomeCategory] = useState<string>(INCOME_CATEGORIES[0]);
  
  const [note, setNote] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialType) setType(initialType);
  }, [initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: Math.abs(Number(amount)),
      type,
      category: type === TransactionType.EXPENSE ? mainCategory : incomeCategory,
      subCategory: type === TransactionType.EXPENSE ? subCategory : undefined,
      note,
      date
    };

    onAdd(newTransaction);
    onClose();
  };

  const renderVerticalListSelector = (
    items: string[], 
    current: string, 
    onChange: (val: string) => void, 
    activeClass: string
  ) => (
    <div className={`flex flex-col gap-1 max-h-48 sm:max-h-56 overflow-y-auto p-1.5 rounded-2xl border custom-scrollbar ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100/50 border-slate-200'}`}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`px-4 py-3 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all text-left border-2 ${
            current === item 
              ? `${activeClass} border-transparent shadow-lg scale-[1.01] translate-x-1` 
              : isDarkMode 
                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 w-full max-w-2xl mx-auto shadow-[0_32px_90px_-16px_rgba(0,0,0,0.6)] border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'}`}>
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tighter flex items-center gap-2">
          NEW <span className={type === TransactionType.EXPENSE ? 'text-rose-600 dark:text-rose-500' : 'text-emerald-600 dark:text-emerald-500'}>{type}</span>
        </h3>
        <button 
          onClick={onClose} 
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Amount Input Section */}
        <div className="relative group text-center mb-6 sm:mb-10">
          <div className="inline-flex items-baseline gap-1 sm:gap-2 relative">
             <span className="text-2xl sm:text-4xl font-black text-slate-300 dark:text-slate-700 group-focus-within:text-indigo-500 transition-colors">₹</span>
             <input
              type="number"
              autoFocus
              required
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-32 sm:w-48 text-center bg-transparent border-none outline-none text-5xl sm:text-7xl font-black placeholder:text-slate-100 dark:placeholder:text-slate-800 p-0 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            />
          </div>
          <div className={`w-full h-1 mt-2 sm:mt-4 rounded-full max-w-[150px] sm:max-w-[200px] mx-auto overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className={`h-full transition-all duration-500 ${type === TransactionType.EXPENSE ? 'bg-rose-500 w-full' : 'bg-emerald-500 w-full'}`} />
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4 sm:space-y-6">
          {type === TransactionType.EXPENSE ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">1. Category</label>
                {renderVerticalListSelector(
                  Object.keys(EXPENSE_STRUCTURE),
                  mainCategory,
                  (val) => {
                    setMainCategory(val);
                    setSubCategory(EXPENSE_STRUCTURE[val as keyof typeof EXPENSE_STRUCTURE][0]);
                  },
                  'bg-indigo-600 text-white shadow-indigo-500/20'
                )}
              </div>
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">2. Sub-Category</label>
                {renderVerticalListSelector(
                  EXPENSE_STRUCTURE[mainCategory as keyof typeof EXPENSE_STRUCTURE] || [],
                  subCategory,
                  setSubCategory,
                  'bg-rose-600 text-white shadow-rose-500/20'
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">Income Source</label>
              {renderVerticalListSelector(
                INCOME_CATEGORIES,
                incomeCategory,
                setIncomeCategory,
                'bg-emerald-600 text-white shadow-emerald-500/20'
              )}
            </div>
          )}
        </div>

        {/* Notes and Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-5 py-3 sm:py-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'}`}
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-[10px] sm:text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] ml-2">Note</label>
            <input
              type="text"
              placeholder="What was this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`w-full px-5 py-3 sm:py-4 border-2 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300'}`}
            />
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          className={`w-full py-5 sm:py-6 rounded-2xl sm:rounded-3xl text-white font-black text-lg sm:text-xl shadow-2xl transition-all active:scale-[0.97] mt-2 flex items-center justify-center gap-4 ${
            type === TransactionType.EXPENSE 
              ? 'bg-rose-600 shadow-rose-200 dark:shadow-rose-950/20 hover:bg-rose-700' 
              : 'bg-emerald-600 shadow-emerald-200 dark:shadow-emerald-950/20 hover:bg-emerald-700'
          }`}
        >
          <span>CONFIRM {type}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1e293b' : '#f8fafc'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#475569' : '#cbd5e1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#64748b' : '#94a3b8'};
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? '#475569 #1e293b' : '#cbd5e1 #f8fafc'};
        }
      `}} />
    </div>
  );
};

export default TransactionForm;
