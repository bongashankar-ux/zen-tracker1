
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, UserProfile } from './types';
import { STORAGE_KEY } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIConsultant from './components/AIConsultant';
import SettingsModal from './components/SettingsModal';

export interface DateRange {
  start: string | null;
  end: string | null;
  label: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  gender: '',
  age: '',
  city: '',
  state: '',
  phone: ''
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formInitialType, setFormInitialType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null, label: 'All Time' });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zen_tracker_theme');
    return saved === 'dark';
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('zen_tracker_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Load transactions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    }
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Handle Theme Persistence
  useEffect(() => {
    localStorage.setItem('zen_tracker_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Profile Persistence
  useEffect(() => {
    localStorage.setItem('zen_tracker_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const openFormWith = (type: TransactionType) => {
    setFormInitialType(type);
    setIsFormOpen(true);
  };

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    // Apply Search Filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(lowerSearch) ||
        (t.subCategory && t.subCategory.toLowerCase().includes(lowerSearch)) ||
        t.note.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply Date Filter
    if (dateRange.start) {
      result = result.filter(t => t.date >= (dateRange.start as string));
    }
    if (dateRange.end) {
      result = result.filter(t => t.date <= (dateRange.end as string));
    }

    return result;
  }, [transactions, searchTerm, dateRange]);

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              <span className="text-white font-black text-xl italic">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">Zen Tracker</h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mindful Finance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-4 sm:pl-6">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:text-indigo-400' : 'bg-slate-100 text-slate-600 hover:text-indigo-600'}`}
                title="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button 
                onClick={() => {
                  if (window.confirm("Start fresh? This will clear all your data.")) {
                    setTransactions([]);
                  }
                }}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest hidden sm:block"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Dashboard & AI (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            <Dashboard 
              transactions={filteredTransactions} 
              onAddClick={openFormWith} 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isFiltered={searchTerm.trim() !== '' || dateRange.label !== 'All Time'}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              isDarkMode={isDarkMode}
            />
            <AIConsultant transactions={transactions} isDarkMode={isDarkMode} />
          </div>

          {/* Activity Column (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <TransactionList 
              transactions={filteredTransactions} 
              onDelete={handleDeleteTransaction} 
              isDarkMode={isDarkMode}
            />
          </div>

        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={userProfile}
          onSave={setUserProfile}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[110] overflow-y-auto">
          <div 
            className={`fixed inset-0 backdrop-blur-md animate-in fade-in duration-300 ${isDarkMode ? 'bg-black/70' : 'bg-slate-900/60'}`} 
            onClick={() => setIsFormOpen(false)}
          />
          
          <div className="relative min-h-screen flex items-center justify-center p-4 pointer-events-none">
            <div className="relative w-full max-w-2xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 pointer-events-auto my-8">
              <TransactionForm 
                onAdd={handleAddTransaction} 
                onClose={() => setIsFormOpen(false)} 
                initialType={formInitialType}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-20 text-center pb-12">
        <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Zen Tracker • Indian Rupee Edition</p>
      </footer>
    </div>
  );
};

export default App;
