import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ArrowUpDown, ChevronDown, Check, Ban, 
  Calendar, Eye, RefreshCw, Sparkles, Download, UserPlus
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreBadge, EligibilityBadge, StatusBadge } from '../components/ScoreBadge';

export function CandidatesPage({ initialJobId, onSelectCandidate, onNavigateToScreening }) {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(initialJobId ? String(initialJobId) : '');
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minScoreFilter, setMinScoreFilter] = useState('');
  const [sortBy, setSortBy] = useState('fit_score');
  const [order, setOrder] = useState('desc');

  const loadFilterData = async () => {
    try {
      const jobsData = await api.getJobs();
      setJobs(jobsData);
    } catch (e) {
      console.error(e);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const filters = {
        jobId: selectedJob || undefined,
        eligibility: eligibilityFilter === 'All' ? undefined : eligibilityFilter,
        status: statusFilter === 'All' ? undefined : statusFilter,
        minScore: minScoreFilter || undefined,
        search: search || undefined,
        sortBy,
        order
      };
      const data = await api.getApplications(filters);
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    if (initialJobId) {
      setSelectedJob(String(initialJobId));
    }
  }, [initialJobId]);

  useEffect(() => {
    loadApplications();
  }, [search, selectedJob, eligibilityFilter, statusFilter, minScoreFilter, sortBy, order]);

  // Action Handlers
  const handleShortlist = async (appId) => {
    try {
      await api.shortlistApplication(appId);
      loadApplications();
    } catch (err) {
      alert(err.message || 'Error shortlisting candidate');
    }
  };

  const handleReject = async (appId) => {
    try {
      await api.rejectApplication(appId);
      loadApplications();
    } catch (err) {
      alert(err.message || 'Error rejecting candidate');
    }
  };

  const handleInterview = async (appId) => {
    try {
      await api.interviewApplication(appId);
      loadApplications();
    } catch (err) {
      alert(err.message || 'Error scheduling interview');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedJob('');
    setEligibilityFilter('All');
    setStatusFilter('All');
    setMinScoreFilter('');
    setSortBy('fit_score');
    setOrder('desc');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Candidate Pool & AI Ranking</h2>
          <p className="text-xs text-slate-500">
            Automated ranking and multi-criteria evaluation powered by ADSA indexed scoring algorithms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToScreening}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Screen New Candidate
          </button>
        </div>
      </div>

      {/* Advanced Search & Filtering Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search box */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate, skill, education..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Job Select */}
          <div>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Job Openings</option>
              {jobs.map((j) => (
                <option key={j.job_id} value={j.job_id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>

          {/* Eligibility Filter */}
          <div>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Eligibility Tiers</option>
              <option value="Eligible">Eligible (&gt;= 75%)</option>
              <option value="Review">Review (50 - 74%)</option>
              <option value="Not Eligible">Not Eligible (&lt; 50%)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Application Statuses</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview Scheduled</option>
              <option value="Review">Under Review</option>
              <option value="Screened">Screened</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>

        {/* Secondary Filter Row: Min Score & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-500">Min Score:</span>
            {['', '50', '75', '85'].map((threshold) => (
              <button
                key={threshold}
                onClick={() => setMinScoreFilter(threshold)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  minScoreFilter === threshold
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {threshold === '' ? 'Any' : `≥ ${threshold}%`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="fit_score">Fit Score (ADSA)</option>
                <option value="experience">Experience</option>
                <option value="education">Education</option>
                <option value="applied_at">Application Date</option>
                <option value="name">Candidate Name</option>
              </select>
            </div>

            <button
              onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-600 font-semibold uppercase text-[10px]"
            >
              {order === 'asc' ? 'Asc ↑' : 'Desc ↓'}
            </button>

            <button
              onClick={clearFilters}
              className="text-slate-400 hover:text-slate-600 underline font-medium ml-1"
            >
              Reset Filters
            </button>
          </div>

        </div>

      </div>

      {/* Candidate Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-14">Rank</th>
                <th className="py-3.5 px-4">Candidate Profile</th>
                <th className="py-3.5 px-4">Applied Job Opening</th>
                <th className="py-3.5 px-4">Skills Verified</th>
                <th className="py-3.5 px-4">AI Fit Score</th>
                <th className="py-3.5 px-4">Eligibility</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Calculating scores and ranks...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No candidates match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const skills = app.skills.split(',').map(s => s.trim()).filter(Boolean);
                  return (
                    <tr key={app.application_id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Rank Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          app.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          app.rank === 2 ? 'bg-slate-200 text-slate-800' :
                          app.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'text-slate-600 bg-slate-100'
                        }`}>
                          {app.rank}
                        </span>
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{app.candidate_name}</div>
                        <div className="text-[11px] text-slate-500">{app.candidate_email}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {app.education} • {app.experience} yr{app.experience === 1 ? '' : 's'} exp
                        </div>
                      </td>

                      {/* Applied Job */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{app.job_title}</div>
                        <div className="text-[11px] text-slate-400">{app.department}</div>
                      </td>

                      {/* Skills Chips */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {skills.slice(0, 3).map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {sk}
                            </span>
                          ))}
                          {skills.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                              +{skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Fit Score */}
                      <td className="py-3 px-4">
                        <ScoreBadge score={app.fit_score} />
                      </td>

                      {/* Eligibility */}
                      <td className="py-3 px-4">
                        <EligibilityBadge eligibility={app.eligibility} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="View Full Profile & Score Breakdown"
                            onClick={() => onSelectCandidate(app)}
                            className="p-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {app.status !== 'Shortlisted' && (
                            <button
                              title="Shortlist Candidate"
                              onClick={() => handleShortlist(app.application_id)}
                              className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {app.status !== 'Rejected' && (
                            <button
                              title="Reject Application"
                              onClick={() => handleReject(app.application_id)}
                              className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {app.status !== 'Interview' && (
                            <button
                              title="Schedule Interview"
                              onClick={() => handleInterview(app.application_id)}
                              className="p-1.5 rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 transition-colors"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {applications.length} candidate applications</span>
          <span className="font-mono text-[11px] text-slate-400">Database Engine: SQLite + ADSA Composite Index</span>
        </div>
      </div>

    </div>
  );
}
