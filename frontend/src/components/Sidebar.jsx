import React from 'react';
import { 
  LayoutDashboard, Briefcase, Users, FileSearch, BarChart3, Settings, 
  Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Database
} from 'lucide-react';

export function Sidebar({ currentTab, setTab, onRunDemo, onResetDb, demoLoading }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Openings', icon: Briefcase },
    { id: 'candidates', label: 'Candidates & Ranking', icon: Users },
    { id: 'screening', label: 'Resume Screener', icon: FileSearch },
    { id: 'technical', label: 'Technical Insights', icon: Database },
    { id: 'analytics', label: 'Recruitment Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System & Engine Rules', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand & Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-tight">TalentPulse AI</h1>
            <p className="text-[11px] text-indigo-400 font-medium tracking-wide">Recruitment ATS & Screening</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Demo Controls Card */}
      <div className="p-3 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Demo Automation
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Run complete screening pipeline on demo candidates for AI/ML Intern opening.
          </p>

          <button
            onClick={onRunDemo}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {demoLoading ? 'Screening...' : 'Run Demo Screening'}
          </button>

          <button
            onClick={onResetDb}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Sample Data
          </button>
        </div>

        {/* Academic Tag */}
        <div className="mt-3 px-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>DMGT + ADSA + DBMS</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
