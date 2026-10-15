import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, Award, AlertTriangle, TrendingUp, 
  Sparkles, UserPlus, FileSearch, ArrowUpRight, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreBadge, EligibilityBadge, StatusBadge } from '../components/ScoreBadge';
import { 
  PipelineFunnelChart, 
  SkillsDistributionChart, 
  FitScoreDistributionChart, 
  EligibilityDonutChart 
} from '../components/RechartsComponents';

export function DashboardPage({ setTab, onSelectCandidate, onRunDemo, demoLoading, onOpenAddCandidate }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [topApplications, setTopApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summary, appsData] = await Promise.all([
        api.getDashboardSummary(),
        api.getApplications({ sortBy: 'fit_score', order: 'desc' })
      ]);
      setDashboardData(summary);
      setTopApplications(appsData.slice(0, 6));
      setError('');
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Could not load dashboard telemetry. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500">Loading HR recruitment analytics...</span>
        </div>
      </div>
    );
  }

  // Exact 5 Required Dashboard KPI Metrics
  const statCards = [
    {
      title: "Total Candidates",
      value: dashboardData?.total_candidates ?? 0,
      subtext: "Evaluated in resume pool",
      icon: Users,
      textColor: "text-indigo-700",
      bgLight: "bg-indigo-50",
      borderColor: "border-indigo-100",
      targetTab: "candidates"
    },
    {
      title: "Eligible Candidates",
      value: dashboardData?.eligible_candidates ?? 0,
      subtext: "Meets rules & fit score ≥ 75%",
      icon: CheckCircle2,
      textColor: "text-emerald-700",
      bgLight: "bg-emerald-50",
      borderColor: "border-emerald-100",
      targetTab: "candidates"
    },
    {
      title: "Candidates Shortlisted",
      value: dashboardData?.shortlisted_candidates ?? 0,
      subtext: "Approved for hiring stages",
      icon: Award,
      textColor: "text-violet-700",
      bgLight: "bg-violet-50",
      borderColor: "border-violet-100",
      targetTab: "candidates"
    },
    {
      title: "Needs Manual Review",
      value: dashboardData?.review_needed_candidates ?? 0,
      subtext: "Score 50–74% or ambiguous data",
      icon: AlertTriangle,
      textColor: "text-amber-700",
      bgLight: "bg-amber-50",
      borderColor: "border-amber-100",
      targetTab: "candidates"
    },
    {
      title: "Average Job-Fit Score",
      value: `${dashboardData?.average_fit_score ?? 0}%`,
      subtext: "Weighted ADSA algorithm mean",
      icon: TrendingUp,
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-100",
      targetTab: "analytics"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Automated HR Recruitment & Decision Support
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI Candidate Screening & Explainable Ranking
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Eliminate manual resume checks. The screening engine computes deterministic eligibility, 
              evaluates configurable 50/30/20% skill & experience weights, and protects applicants from demographic bias.
            </p>
          </div>

          {/* Quick Actions Cluster */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (onOpenAddCandidate) {
                  onOpenAddCandidate();
                } else {
                  setTab('candidates');
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-indigo-600" />
              Add Candidate
            </button>

            <button
              onClick={() => setTab('screening')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all cursor-pointer"
            >
              <FileSearch className="w-4 h-4 text-amber-300" />
              Run Screening
            </button>

            <button
              onClick={onRunDemo}
              disabled={demoLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {demoLoading ? 'Running...' : 'Demo Scenario'}
            </button>

            <button
              onClick={loadDashboardData}
              title="Refresh Telemetry"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadDashboardData} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* Top 5 KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => setTab(card.targetTab)}
              className={`bg-white p-5 rounded-2xl border ${card.borderColor} shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${card.bgLight} ${card.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 hover:text-slate-500" />
              </div>

              <div className="mt-4">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{card.value}</div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">{card.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{card.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Analytics Row: Candidate Pipeline Funnel + Skills Distribution (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Candidate Pipeline Chart (Recharts) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Candidate Pipeline Funnel
              </h3>
              <p className="text-xs text-slate-500">Recruitment velocity across screening stages</p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Recharts Visualizer
            </span>
          </div>

          <div className="pt-2">
            <PipelineFunnelChart data={dashboardData?.pipeline || []} />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Stages: Applied → Screened → Eligible → Shortlist</span>
            <button
              onClick={() => setTab('candidates')}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              View Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skills Distribution Chart (Recharts) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Candidate Skills Distribution
              </h3>
              <p className="text-xs text-slate-500">Verified competencies across candidate resumes</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Keyword Parsed
            </span>
          </div>

          <div className="pt-2">
            <SkillsDistributionChart data={dashboardData?.top_skills || []} />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Top verified tech stack keywords in active applications</span>
            <button
              onClick={() => setTab('candidates')}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              Search Skills <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Top Priority Ranked Candidates & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Top Candidates Ranked */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Top Screened Candidates (Priority Ranked)
              </h3>
              <p className="text-xs text-slate-500">Deterministic scoring order for active openings</p>
            </div>
            <button
              onClick={() => setTab('candidates')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View Full Pool
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate Profile</th>
                  <th className="py-3 px-4">Applied Role</th>
                  <th className="py-3 px-4">Fit Score</th>
                  <th className="py-3 px-4">Eligibility</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {topApplications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-700">
                      #{app.rank}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{app.candidate_name}</div>
                      <div className="text-[11px] text-slate-400">{app.education} • {app.experience}y exp</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium">{app.job_title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <ScoreBadge score={app.fit_score} />
                    </td>
                    <td className="py-3 px-4">
                      <EligibilityBadge eligibility={app.eligibility} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectCandidate(app)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 6 priority-ranked applications</span>
            <button
              onClick={() => setTab('candidates')}
              className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Filter & Sort All Applicants <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Score Distribution & Eligibility Ratio */}
        <div className="space-y-6">
          {/* Eligibility Donut */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Candidate Eligibility Ratio
            </h3>
            <p className="text-xs text-slate-500 mb-3">Deterministic rule-engine distribution</p>
            <EligibilityDonutChart data={[
              { name: "Eligible", value: dashboardData?.eligible_candidates ?? 0 },
              { name: "Review", value: dashboardData?.review_needed_candidates ?? 0 },
              { name: "Not Eligible", value: dashboardData?.not_eligible_candidates ?? 0 }
            ]} />
          </div>

          {/* Fit Score Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Fit Score Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-3">Volume across qualification tiers</p>
            <FitScoreDistributionChart data={[
              { range: "90-100%", count: topApplications.filter(a => a.fit_score >= 90).length },
              { range: "75-89%", count: topApplications.filter(a => a.fit_score >= 75 && a.fit_score < 90).length },
              { range: "50-74%", count: topApplications.filter(a => a.fit_score >= 50 && a.fit_score < 75).length },
              { range: "<50%", count: topApplications.filter(a => a.fit_score < 50).length }
            ]} />
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Candidate Activity Stream */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Recent Candidate Activity Stream
            </h3>
            <p className="text-xs text-slate-500">Live timeline of recent evaluations, status changes, and applications</p>
          </div>
          <button
            onClick={() => setTab('screening')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Screen New Resume <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(dashboardData?.recent_activity || []).map((activity, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/60 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{activity.candidate_name}</div>
                  <div className="text-[11px] text-slate-500">{activity.job_title}</div>
                </div>
                <StatusBadge status={activity.status} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                <ScoreBadge score={activity.fit_score} size="sm" />
                <EligibilityBadge eligibility={activity.eligibility} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
