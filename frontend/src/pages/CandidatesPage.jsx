import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, ArrowUpDown, Check, Ban, 
  Eye, Sparkles, UserPlus, Edit3, Trash2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreBadge, EligibilityBadge, StatusBadge } from '../components/ScoreBadge';
import { AddCandidateModal } from '../components/AddCandidateModal';
import { EditCandidateModal } from '../components/EditCandidateModal';

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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState(null);

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
      // Reset to page 1 on filter changes if current page exceeds bounds
      setCurrentPage(1);
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

  const handleDeleteCandidate = async (candidateId, name) => {
    if (window.confirm(`Are you sure you want to delete candidate "${name}" (ID #${candidateId})? This action cannot be undone.`)) {
      try {
        await api.deleteCandidate(candidateId);
        loadApplications();
      } catch (err) {
        alert(err.message || 'Failed to delete candidate');
      }
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
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalItems = applications.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return applications.slice(start, start + pageSize);
  }, [applications, currentPage, pageSize]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Candidate Pool & Management</h2>
          <p className="text-xs text-slate-500">
            Search, filter, edit, and rank candidate profiles with deterministic ADSA weighted scoring
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
            Add Candidate
          </button>

          <button
            onClick={onNavigateToScreening}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
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
              <option value="Review">Needs Review (50 - 74%)</option>
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
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 text-[11px]">Min Score:</span>
            {['', '50', '75', '85'].map((threshold) => (
              <button
                key={threshold}
                onClick={() => setMinScoreFilter(threshold)}
                className={`px-2.5 py-0.5 rounded-md text-xs transition-colors ${
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
              <span className="font-semibold text-[11px]">Sort By:</span>
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
                <th className="py-3.5 px-3 w-12 text-center">Rank</th>
                <th className="py-3.5 px-3">Candidate ID</th>
                <th className="py-3.5 px-4">Candidate Profile</th>
                <th className="py-3.5 px-4">Applied Job Opening</th>
                <th className="py-3.5 px-4">Skills Verified</th>
                <th className="py-3.5 px-3">Education & Exp</th>
                <th className="py-3.5 px-3">AI Fit Score</th>
                <th className="py-3.5 px-3">Eligibility</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Calculating scores and ranks...
                    </div>
                  </td>
                </tr>
              ) : paginatedApplications.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No candidates match the specified filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app) => {
                  const skills = (app.skills || '').split(',').map(s => s.trim()).filter(Boolean);
                  return (
                    <tr key={app.application_id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Priority Rank */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          app.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          app.rank === 2 ? 'bg-slate-200 text-slate-800' :
                          app.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'text-slate-600 bg-slate-100'
                        }`}>
                          {app.rank}
                        </span>
                      </td>

                      {/* Candidate ID */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-500 font-semibold">
                        CAND-{String(app.candidate_id).padStart(3, '0')}
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{app.candidate_name}</div>
                        <div className="text-[11px] text-slate-500">{app.candidate_email}</div>
                        {app.candidate_phone && (
                          <div className="text-[10px] text-slate-400">{app.candidate_phone}</div>
                        )}
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

                      {/* Education & Experience */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-700 text-[11px]">{app.education}</div>
                        <div className="text-[10px] text-slate-400">{app.experience} yr{app.experience === 1 ? '' : 's'} exp</div>
                      </td>

                      {/* Fit Score */}
                      <td className="py-3 px-3">
                        <ScoreBadge score={app.fit_score} />
                      </td>

                      {/* Eligibility */}
                      <td className="py-3 px-3">
                        <EligibilityBadge eligibility={app.eligibility} />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            title="View Full Profile & Score Breakdown"
                            onClick={() => onSelectCandidate(app)}
                            className="p-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit candidate */}
                          <button
                            title="Edit Candidate Information"
                            onClick={() => setCandidateToEdit(app)}
                            className="p-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete candidate */}
                          <button
                            title="Delete Candidate"
                            onClick={() => handleDeleteCandidate(app.candidate_id, app.candidate_name)}
                            className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Shortlist */}
                          {app.status !== 'Shortlisted' && (
                            <button
                              title="Shortlist Candidate"
                              onClick={() => handleShortlist(app.application_id)}
                              className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Reject */}
                          {app.status !== 'Rejected' && (
                            <button
                              title="Reject Application"
                              onClick={() => handleReject(app.application_id)}
                              className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
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

        {/* Pagination & Footer bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Showing {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems} candidates
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded border border-slate-200 bg-white text-xs"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCandidateAdded={() => {
          loadApplications();
          loadFilterData();
        }}
        jobs={jobs}
      />

      {/* Edit Candidate Modal */}
      {candidateToEdit && (
        <EditCandidateModal
          isOpen={!!candidateToEdit}
          onClose={() => setCandidateToEdit(null)}
          candidate={candidateToEdit}
          onCandidateUpdated={() => {
            loadApplications();
            setCandidateToEdit(null);
          }}
        />
      )}

    </div>
  );
}
