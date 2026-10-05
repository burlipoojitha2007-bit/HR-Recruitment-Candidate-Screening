import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  UserCheck, 
  Layers, 
  Database, 
  Cpu, 
  CheckCircle2, 
  ChevronDown,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Recruiter } from '../types';

interface NavbarProps {
  activeRecruiter: Recruiter;
  recruiters: Recruiter[];
  onSelectRecruiter: (recruiter: Recruiter) => void;
  onOpenQuickSearch: () => void;
  onNavigate: (page: string) => void;
  candidateCount: number;
  avgFitScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRecruiter,
  recruiters,
  onSelectRecruiter,
  onOpenQuickSearch,
  onNavigate,
  candidateCount,
  avgFitScore
}) => {
  const [showRecruiterMenu, setShowRecruiterMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Academic Subject Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white text-[11px] font-medium py-1 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="flex items-center gap-1 text-blue-300 font-semibold uppercase tracking-wider text-[10px]">
            <Cpu className="w-3 h-3 text-blue-400" />
            Curriculum Integration:
          </span>
          <span className="bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded border border-blue-700/50">DBMS (SQL/ER)</span>
          <span className="bg-purple-900/60 text-purple-200 px-1.5 py-0.5 rounded border border-purple-700/50">ADDSA (B-Tree)</span>
          <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded border border-amber-700/50">DMGT (Relations)</span>
          <span className="bg-indigo-900/60 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-700/50">OOPJ (ATS State)</span>
          <span className="bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700/50">Python (Fit Score)</span>
          <span className="bg-rose-900/60 text-rose-200 px-1.5 py-0.5 rounded border border-rose-700/50">Java (Eligibility)</span>
        </div>

        <button 
          onClick={() => onNavigate('architecture')}
          className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
        >
          <span>View Architecture</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Main Navbar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('dashboard')} 
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base leading-tight">
                  TalentSphere
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                  HR SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none hidden sm:block">
                Recruitment & Screening System
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Pipeline
            </span>
            <span>•</span>
            <span>{candidateCount} Active Candidates</span>
            <span>•</span>
            <span>Avg Fit: <strong className="text-slate-800 font-semibold">{avgFitScore}%</strong></span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div 
            onClick={onOpenQuickSearch}
            className="w-full flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-xs cursor-pointer transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="flex-1">Quick search candidates, skills, or requisitions...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-500 shadow-2xs">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Search mobile icon */}
          <button 
            onClick={onOpenQuickSearch} 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800">Recruitment Activity</span>
                  <span className="text-[10px] text-blue-600 font-medium">3 New</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 hover:bg-slate-50">
                    <p className="font-medium text-slate-800">Aarav Patel shortlisted</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">High Python fit score (92%) for Full Stack role</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">15 mins ago</span>
                  </div>
                  <div className="p-3 hover:bg-slate-50">
                    <p className="font-medium text-slate-800">Interview Scheduled</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Ananya Deshmukh for System Design round</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                  </div>
                  <div className="p-3 hover:bg-slate-50">
                    <p className="font-medium text-slate-800">Java Screening Filter</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">2 ineligible candidates flagged automatically</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">3 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Recruiter Selector */}
          <div className="relative">
            <button
              onClick={() => setShowRecruiterMenu(!showRecruiterMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <img
                src={activeRecruiter.avatar}
                alt={activeRecruiter.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-600/30"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {activeRecruiter.name}
                </p>
                <p className="text-[10px] text-slate-500 leading-none">
                  {activeRecruiter.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRecruiterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Recruiter Session
                  </p>
                </div>
                {recruiters.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRecruiter(r);
                      setShowRecruiterMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs hover:bg-slate-50 transition-colors ${
                      r.id === activeRecruiter.id ? 'bg-blue-50/70 font-semibold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs">{r.name}</p>
                      <p className="text-[10px] text-slate-500">{r.role}</p>
                    </div>
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1 px-3">
                  <button 
                    onClick={() => {
                      onNavigate('settings');
                      setShowRecruiterMenu(false);
                    }}
                    className="w-full text-left text-xs py-1.5 text-slate-600 hover:text-slate-900"
                  >
                    Settings & System Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
