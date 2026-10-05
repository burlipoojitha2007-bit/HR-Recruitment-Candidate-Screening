import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  GitPullRequest, 
  Binary, 
  Sparkles, 
  Database, 
  Network, 
  BarChart3, 
  Layers, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileCode2
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  eligibleCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  eligibleCount
}) => {
  const navSections = [
    {
      group: 'RECRUITMENT CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, academic: null },
        { id: 'candidates', label: 'Candidates', icon: Users, badge: null, academic: 'OOPJ' },
        { id: 'jobs', label: 'Job Requisitions', icon: Briefcase, badge: null, academic: 'DBMS' },
        { id: 'ats', label: 'ATS Pipeline', icon: GitPullRequest, badge: 'Kanban', academic: 'OOPJ' },
      ]
    },
    {
      group: 'ACADEMIC ALGORITHMS',
      items: [
        { id: 'btree', label: 'B-Tree Indexing', icon: Binary, badge: 'O(log N)', academic: 'ADDSA', color: 'text-purple-600' },
        { id: 'fitscore', label: 'Fit-Score Classifier', icon: Sparkles, badge: 'Python', academic: 'Python', color: 'text-emerald-600' },
        { id: 'sql', label: 'SQL / Relational DB', icon: Database, badge: 'DBMS', academic: 'DBMS', color: 'text-blue-600' },
        { id: 'dmgt', label: 'DMGT Relations', icon: Network, badge: 'Graph', academic: 'DMGT', color: 'text-amber-600' },
      ]
    },
    {
      group: 'INTELLIGENCE & SYSTEM',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null, academic: null },
        { id: 'architecture', label: 'System Architecture', icon: Layers, badge: 'Workflow', academic: 'Full Stack' },
        { id: 'settings', label: 'Settings & DB Reset', icon: Settings, badge: null, academic: null },
      ]
    }
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200/90 flex flex-col justify-between transition-all duration-300 ease-in-out z-30 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {section.group}
              </h3>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? `${item.label} (${item.academic || ''})` : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.color || 'text-slate-500'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && isActive && (
                      <span className="absolute right-1 w-1.5 h-6 bg-blue-600 rounded-l"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Academic Callout & Toggle */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 mb-2.5">
            <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Java Rules Active</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Automated predicates evaluating skills, exp & degrees.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-xs"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
