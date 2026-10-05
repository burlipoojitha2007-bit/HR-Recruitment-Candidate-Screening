import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Briefcase, Users, Trash2, Edit3, ArrowRight, 
  Sparkles, CheckCircle2, Clock, Filter, Eye
} from 'lucide-react';
import { api } from '../services/api';
import { CreateJobModal } from '../components/CreateJobModal';
import { ScoreBadge } from '../components/ScoreBadge';

export function JobsPage({ onSelectJobForCandidates, onSelectJobForScreening }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs(search, statusFilter === 'All' ? '' : statusFilter);
      setJobs(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [search, statusFilter]);

  const handleCreateOrUpdate = async (formData, jobId) => {
    if (jobId) {
      await api.updateJob(jobId, formData);
    } else {
      await api.createJob(formData);
    }
    loadJobs();
  };

  const handleDeleteJob = async (jobId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also remove all associated applications.`)) {
      try {
        await api.deleteJob(jobId);
        loadJobs();
      } catch (err) {
        alert(err.message || 'Error deleting job');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Job Openings Management</h2>
          <p className="text-xs text-slate-500">
            Define role qualifications, required skills (50%), experience limits, and review applicants
          </p>
        </div>

        <button
          onClick={() => { setEditingJob(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Job Opening
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by job title, department, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Status:</span>
          {['All', 'Active', 'Draft', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Job Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading job openings...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="text-base font-semibold text-slate-700">No Job Openings Found</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new job opening to start receiving candidates.
          </p>
          <button
            onClick={() => { setEditingJob(null); setModalOpen(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
          >
            <Plus className="w-4 h-4" /> Create Opening
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const reqSkills = job.required_skills.split(',').map(s => s.trim()).filter(Boolean);
            const prefSkills = job.preferred_skills ? job.preferred_skills.split(',').map(s => s.trim()).filter(Boolean) : [];

            return (
              <div
                key={job.job_id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  
                  {/* Top line: Department & Status badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                      {job.department}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {/* Job Metadata details */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Min {job.minimum_experience} yrs
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{job.education_requirement}</span>
                  </div>

                  {/* Required Skills Chips */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Required Skills (50% Weight)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {reqSkills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {s}
                        </span>
                      ))}
                      {reqSkills.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                          +{reqSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Card Footer: Metrics & Action Buttons */}
                <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{job.applicant_count}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Applicants</div>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                      <div className="text-sm font-bold text-indigo-700">{job.average_fit_score}%</div>
                      <div className="text-[10px] text-slate-400 uppercase">Avg Score</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      title="Screen New Candidate for this Job"
                      onClick={() => onSelectJobForScreening(job.job_id)}
                      className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      title="View Filtered Candidates"
                      onClick={() => onSelectJobForCandidates(job.job_id)}
                      className="p-1.5 rounded-lg bg-slate-200/80 text-slate-700 hover:bg-slate-300 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                    <button
                      title="Edit Job"
                      onClick={() => { setEditingJob(job); setModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete Job"
                      onClick={() => handleDeleteJob(job.job_id, job.title)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating or Editing Jobs */}
      <CreateJobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateOrUpdate}
        initialData={editingJob}
      />

    </div>
  );
}
