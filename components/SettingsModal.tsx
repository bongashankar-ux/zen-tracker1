
import React, { useState } from 'react';
import { UserProfile } from '../types';
// Add missing import for STORAGE_KEY
import { STORAGE_KEY } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isDarkMode: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, profile, onSave, isDarkMode }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    onSave(localProfile);
    onClose();
  };

  const inputClass = `w-full px-5 py-4 border-2 rounded-2xl outline-none font-bold text-sm transition-all focus:border-indigo-500 ${
    isDarkMode 
      ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-600' 
      : 'bg-slate-50 border-slate-100 text-slate-800 placeholder:text-slate-300'
  }`;

  const labelClass = `block text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-2 ${
    isDarkMode ? 'text-slate-600' : 'text-slate-400'
  }`;

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      <div 
        className={`fixed inset-0 backdrop-blur-md animate-in fade-in duration-300 ${isDarkMode ? 'bg-black/80' : 'bg-slate-900/60'}`} 
        onClick={onClose}
      />
      
      <div className="relative min-h-screen flex items-center justify-center p-4 pointer-events-none">
        <div className={`relative w-full max-w-xl animate-in fade-in zoom-in duration-300 pointer-events-auto my-8 rounded-[2.5rem] p-8 sm:p-10 border shadow-2xl ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white'
        }`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tight">Settings</h2>
            <button 
              onClick={onClose} 
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${
                isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-10">
            {/* Profile Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold tracking-tight">Option 1 - Profile</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={localProfile.name}
                    onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Gender</label>
                  <select 
                    value={localProfile.gender}
                    onChange={(e) => setLocalProfile({...localProfile, gender: e.target.value})}
                    className={inputClass}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Age</label>
                  <input 
                    type="number" 
                    placeholder="Years" 
                    value={localProfile.age}
                    onChange={(e) => setLocalProfile({...localProfile, age: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>City</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mumbai" 
                    value={localProfile.city}
                    onChange={(e) => setLocalProfile({...localProfile, city: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>State</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Maharashtra" 
                    value={localProfile.state}
                    onChange={(e) => setLocalProfile({...localProfile, state: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000" 
                    value={localProfile.phone}
                    onChange={(e) => setLocalProfile({...localProfile, phone: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleSave}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                SAVE PROFILE
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button 
                onClick={() => {
                   if (window.confirm("Start fresh? This will clear ALL your financial records.")) {
                      // Fix: STORAGE_KEY is now available via import
                      localStorage.removeItem(STORAGE_KEY);
                      window.location.reload();
                   }
                }}
                className="w-full mt-4 py-3 text-rose-500 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-colors sm:hidden"
              >
                Reset Financial Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
