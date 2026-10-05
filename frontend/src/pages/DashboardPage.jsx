import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, CheckCircle, Sparkles, TrendingUp, ArrowUpRight, 
  ChevronRight, Award, AlertCircle, FileSearch, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreBadge, EligibilityBadge, StatusBadge } from '../components/ScoreBadge';
import { ScoreDistributionBarChart, EligibilityDonutChart } from '../components/SimpleCharts';

export function DashboardPage({ setTab, onSelectCandidate, onRunDemo, demoLoading }) {
  const [analytics, setAnalytics] = useState(null);
  const [topApplications, setTopApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsData, appsData] = await Promise.all([
        api.getAnalytics(),
        api.getApplications({ sortBy: 'fit_score', order: 'desc' })
      ]);
      setAnalytics(analyticsData);
      setTopApplications(appsData.slice(0, 6));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not load dashboard telemetry. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-500">Loading HR recruitment dashboard...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Job Openings",
      value: analytics?.total_jobs ?? 0,
      subtext: "Across engineering & AI roles",
      icon: Briefcase,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50",
      targetTab: "jobs"
    },
    {
      title: "Candidate Profiles",
      value: analytics?.total_candidates ?? 0,
      subtext: "Evaluated in resume database",
      icon: Users,
      color: "bg-indigo-600",
      textColor: "text-indigo-700",
      bgLight: "bg-indigo-50",
      targetTab: "candidates"
    },
    {
      title: "Eligible Candidates",
      value: analytics?.eligible_count ?? 0,
      subtext: "Fit Score >= 75% threshold",
      icon: CheckCircle,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgLight: "bg-emerald-50",
      targetTab: "candidates"
    },
    {
      title: "Shortlisted for Interview",
      value: analytics?.shortlisted_count ?? 0,
      subtext: "Approved by HR recruiters",
      icon: Award,
      color: "bg-violet-600",
      textColor: "text-violet-700",
      bgLight: "bg-violet-50",
      targetTab: "candidates"
    },
    {
      title: "Average Match Quality",
      value: `${analytics?.average_fit_score ?? 0}%`,
      subtext: "Mean candidate fit score",
      icon: TrendingUp,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgLight: "bg-amber-50",
      targetTab: "analytics"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Demo Scenario Callout Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Featured Demonstration Scenario
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Automated Resume Screening: AI/ML Intern & Python AI Roles
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Eliminate manual resume checks. The Python Screening Engine applies DMGT decision rules and ADSA weighted scoring 
              (50% Skills, 20% Experience, 15% Education, 10% Preferred, 5% Keywords) to objectively rank applicants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setTab('screening')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              <FileSearch className="w-4 h-4 text-indigo-600" />
              Screen New Resume
            </button>
            <button
              onClick={onRunDemo}
              disabled={demoLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md shadow-indigo-500/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {demoLoading ? 'Running Pipeline...' : 'Run Demo Screening'}
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
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
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

      {/* Main Grid: Top Ranked Candidates & Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Top Candidates Ranked */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Top Screened Candidates (Priority Ranked)
              </h3>
              <p className="text-xs text-slate-500">Auto-calculated using ADSA candidate ranking formula</p>
            </div>
            <button
              onClick={() => setTab('candidates')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View Full Pool
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Applied Role</th>
                  <th className="py-3 px-4">AI Fit Score</th>
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
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 6 shortlisted & screened applications</span>
            <button
              onClick={() => setTab('candidates')}
              className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              Filter & Sort All Applicants <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Score Distribution & Eligibility */}
        <div className="space-y-6">
          {/* Eligibility Donut */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Candidate Eligibility Ratio
            </h3>
            <p className="text-xs text-slate-500 mb-4">DMGT Decision rule classifications</p>
            <EligibilityDonutChart data={analytics?.eligibility_breakdown || []} />
          </div>

          {/* Fit Score Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Score Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">Volume across qualification tiers</p>
            <ScoreDistributionBarChart data={analytics?.score_distribution || []} />
          </div>
        </div>

      </div>

      {/* Bottom Row: Jobs with Most Applicants & Recent Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Openings with Applicants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Popular Job Openings
              </h3>
              <p className="text-xs text-slate-500">Applicant volume & average scores per position</p>
            </div>
            <button
              onClick={() => setTab('jobs')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Manage Jobs
            </button>
          </div>

          <div className="space-y-3">
            {(analytics?.top_jobs || []).map((job) => (
              <div key={job.job_id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-800">{job.title}</div>
                  <div className="text-[11px] text-slate-400">{job.department}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{job.applicants}</span>
                    <span className="text-[10px] text-slate-400 block">applicants</span>
                  </div>
                  <ScoreBadge score={job.avg_score} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Screening Activity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Recent Screening Stream
              </h3>
              <p className="text-xs text-slate-500">Real-time candidate evaluations</p>
            </div>
            <button
              onClick={() => setTab('screening')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Upload Resume
            </button>
          </div>

          <div className="space-y-2.5">
            {(analytics?.recent_applications || []).map((app, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{app.candidate_name}</div>
                  <div className="text-[11px] text-slate-500">{app.job_title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <ScoreBadge score={app.fit_score} size="sm" />
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
