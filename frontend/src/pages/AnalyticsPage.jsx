import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Users, CheckCircle, 
  XCircle, Award, Briefcase, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { 
  ScoreDistributionBarChart, 
  EligibilityDonutChart, 
  ApplicationsPerJobBarChart 
} from '../components/SimpleCharts';

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading && !analytics) {
    return <div className="text-center py-20 text-slate-400 text-sm">Aggregating recruitment metrics...</div>;
  }

  const totalApps = analytics?.total_applications || 1;
  const shortlistRate = Math.round(((analytics?.shortlisted_count || 0) / totalApps) * 100);
  const rejectionRate = Math.round(((analytics?.rejected_count || 0) / totalApps) * 100);
  const interviewRate = Math.round(((analytics?.interview_count || 0) / totalApps) * 100);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recruitment Analytics & Insights</h2>
          <p className="text-xs text-slate-500">
            SQL Aggregation queries on SQLite database (averages, distributions, qualification rates)
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Metrics
        </button>
      </div>

      {/* Top 4 Pipeline Conversion Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Applications Evaluated</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{analytics?.total_applications}</div>
          <div className="text-xs text-slate-500 mt-1">Across {analytics?.total_jobs} active openings</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Shortlist Conversion Rate</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{shortlistRate}%</div>
          <div className="text-xs text-slate-500 mt-1">{analytics?.shortlisted_count} candidates shortlisted</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Interview Rate</div>
          <div className="text-3xl font-extrabold text-indigo-600 mt-2">{interviewRate}%</div>
          <div className="text-xs text-slate-500 mt-1">{analytics?.interview_count} interviews scheduled</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Rejection Rate</div>
          <div className="text-3xl font-extrabold text-rose-500 mt-2">{rejectionRate}%</div>
          <div className="text-xs text-slate-500 mt-1">{analytics?.rejected_count} below threshold</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Fit Score Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Candidate Fit Score Distribution
            </h3>
            <p className="text-xs text-slate-500">Applicant spread across qualification tiers</p>
          </div>
          <ScoreDistributionBarChart data={analytics?.score_distribution || []} />
        </div>

        {/* Chart 2: Eligibility Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Candidates by Eligibility (DMGT Logic)
            </h3>
            <p className="text-xs text-slate-500">Eligible (&gt;=75%), Review (50-74%), Not Eligible (&lt;50%)</p>
          </div>
          <EligibilityDonutChart data={analytics?.eligibility_breakdown || []} />
        </div>

        {/* Chart 3: Applications per Job Opening */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Applications per Job Opening
            </h3>
            <p className="text-xs text-slate-500">Volume and average candidate score per position</p>
          </div>
          <ApplicationsPerJobBarChart data={analytics?.top_jobs || []} />
        </div>

        {/* Chart 4: Recruitment Status Funnel & Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Candidate Status Distribution
            </h3>
            <p className="text-xs text-slate-500">Progress across HR screening stages</p>
          </div>

          <div className="space-y-3 pt-2">
            {(analytics?.status_breakdown || []).map((st, idx) => {
              const pct = Math.round((st.count / totalApps) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{st.status}</span>
                    <span>{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: st.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
