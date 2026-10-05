import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Save } from 'lucide-react';

export function CreateJobModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    description: '',
    required_skills: '',
    preferred_skills: '',
    minimum_experience: 0,
    education_requirement: 'BTech / BE / MCA',
    status: 'Active'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        department: initialData.department || 'Engineering',
        description: initialData.description || '',
        required_skills: initialData.required_skills || '',
        preferred_skills: initialData.preferred_skills || '',
        minimum_experience: initialData.minimum_experience ?? 0,
        education_requirement: initialData.education_requirement || 'BTech / BE / MCA',
        status: initialData.status || 'Active'
      });
    } else {
      setFormData({
        title: '',
        department: 'AI/ML Engineering',
        description: '',
        required_skills: 'Python, Machine Learning, SQL',
        preferred_skills: 'Pandas, NumPy, Git',
        minimum_experience: 0,
        education_requirement: 'BTech / BE / MCA',
        status: 'Active'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!formData.required_skills.trim()) {
      setError('Please specify at least one required skill.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onSave(formData, initialData ? initialData.job_id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save job opening.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {initialData ? 'Edit Job Opening' : 'Create New Job Opening'}
              </h3>
              <p className="text-xs text-slate-500">Configure job specifications and screening criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Python AI Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI/ML, Engineering, Data"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Required Skills (Weight: 50%) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Python, Machine Learning, SQL, FastAPI"
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="text-[11px] text-slate-500">Comma-separated skills candidates must possess to be eligible.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Preferred Skills (Weight: 10%)
            </label>
            <input
              type="text"
              placeholder="e.g. Pandas, NumPy, Git, React, Docker"
              value={formData.preferred_skills}
              onChange={(e) => setFormData({ ...formData, preferred_skills: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Min Experience (Years)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.minimum_experience}
                onChange={(e) => setFormData({ ...formData, minimum_experience: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Education Requirement
              </label>
              <input
                type="text"
                placeholder="e.g. BTech / BE / MCA"
                value={formData.education_requirement}
                onChange={(e) => setFormData({ ...formData, education_requirement: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Job Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Job Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a comprehensive job description for keyword relevance scoring..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Opening')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
