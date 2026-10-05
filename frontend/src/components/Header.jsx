import React from 'react';
import { Search, Bell, Sparkles, UserCheck } from 'lucide-react';

export function Header({ currentTab, onRunDemo, demoLoading, globalSearch, setGlobalSearch }) {
  const titles = {
    dashboard: 'Recruiter Dashboard',
    jobs: 'Job Openings & Requirements',
    candidates: 'Candidate Pool & AI Ranking',
    screening: 'Interactive Resume Screening',
    analytics: 'Recruitment Analytics & Insights',
    settings: 'Engine Weights & System Rules',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Context */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 leading-tight">
          {titles[currentTab] || 'HR Recruitment System'}
        </h2>
        <p className="text-[11px] text-slate-500 hidden sm:block">
          AI Candidate Filtering, ADSA Scoring & Recruiter Shortlisting
        </p>
      </div>

      {/* Center Global Search */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Quick search candidate, skill..."
          value={globalSearch || ''}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRunDemo}
          disabled={demoLoading}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          {demoLoading ? 'Running Demo...' : 'Demo Scenario'}
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <button 
          title="Notifications"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            SJ
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-tight">Sarah Jenkins</div>
            <div className="text-[10px] text-slate-500">Lead HR Recruiter</div>
          </div>
        </div>
      </div>
    </header>
  );
}
