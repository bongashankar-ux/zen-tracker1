
import React, { useState, useEffect } from 'react';
import { Transaction, FinancialInsight } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AIConsultantProps {
  transactions: Transaction[];
  isDarkMode: boolean;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ transactions, isDarkMode }) => {
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (transactions.length < 3) return;
    setLoading(true);
    try {
      const data = await getFinancialAdvice(transactions);
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch if we have enough data
    if (transactions.length >= 3 && insights.length === 0) {
      fetchInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  return (
    <div className={`rounded-2xl p-6 shadow-xl transition-colors duration-300 ${isDarkMode ? 'bg-indigo-950/40 text-white shadow-indigo-900/10 border border-indigo-900/30' : 'bg-indigo-900 text-white shadow-indigo-200'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span className="text-indigo-400">✨</span> Gemini Coach
          </h3>
          <p className="text-indigo-200/70 text-xs">AI-powered financial insights</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading || transactions.length < 3}
          className="bg-indigo-700/50 hover:bg-indigo-700 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {transactions.length < 3 ? (
        <div className={`text-center py-6 rounded-xl border ${isDarkMode ? 'bg-indigo-900/10 border-indigo-800/30' : 'bg-indigo-800/30 border-indigo-700/30'}`}>
          <p className="text-sm text-indigo-200">Add at least 3 transactions to unlock AI insights!</p>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-indigo-700/50 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-indigo-700/50 rounded"></div>
                  <div className="h-3 bg-indigo-700/50 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map((insight, idx) => (
            <div key={idx} className="group cursor-default">
              <div className="flex gap-3">
                <div className={`w-1 h-auto rounded-full ${
                  insight.sentiment === 'positive' ? 'bg-emerald-400' : 
                  insight.sentiment === 'negative' ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-indigo-100 dark:text-indigo-200/80 leading-relaxed mb-2">{insight.description}</p>
                  <div className={`p-2 rounded-lg border ${isDarkMode ? 'bg-indigo-950/60 border-indigo-800/40' : 'bg-indigo-800/50 border-indigo-700/50'}`}>
                    <p className="text-xs italic text-indigo-300">💡 {insight.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIConsultant;
