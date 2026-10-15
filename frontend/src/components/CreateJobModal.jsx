import React, { useState, useEffect } from 'react';
import { X, Briefcase, Plus, Save, Sliders, AlertTriangle } from 'lucide-react';

export function CreateJobModal({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    description: '',
    required_skills: '',
    preferred_skills: '',
    minimum_experience: 0,
    education_requirement: 'BTech / BE / MCA',
    skill_weight: 50,
    experience_weight: 30,
    education_weight: 20,
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
        minimum_experience: initialData.minimum_experience !== undefined ? initialData.minimum_experience : 0,
        education_requirement: initialData.education_requirement || 'BTech / BE / MCA',
        skill_weight: initialData.skill_weight ? Math.round(initialData.skill_weight * 100) : 50,
        experience_weight: initialData.experience_weight ? Math.round(initialData.experience_weight * 100) : 30,
        education_weight: initialData.education_weight ? Math.round(initialData.education_weight * 100) : 20,
        status: initialData.status || 'Active'
      });
    } else {
      setFormData({
        title: '',
        department: 'Engineering',
        description: '',
        required_skills: 'Python, SQL, FastAPI',
        preferred_skills: 'Docker, Git, React',
        minimum_experience: 1,
        education_requirement: 'BTech / BE / MCA',
        skill_weight: 50,
        experience_weight: 30,
        education_weight: 20,
        status: 'Active'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time calculation of weight sum
  const weightTotal = Number(formData.skill_weight) + Number(formData.experience_weight) + Number(formData.education_weight);

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

    // Normalize weights to 1.0
    const sum = weightTotal > 0 ? weightTotal : 100;
    const normalizedPayload = {
      ...formData,
      minimum_experience: parseFloat(formData.minimum_experience) || 0,
      skill_weight: parseFloat((formData.skill_weight / sum).toFixed(2)),
      experience_weight: parseFloat((formData.experience_weight / sum).toFixed(2)),
      education_weight: parseFloat((formData.education_weight / sum).toFixed(2))
    };

    setLoading(true);
    setError('');
    try {
      await onSave(normalizedPayload, initialData ? initialData.job_id : null);
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
                {initialData ? 'Edit Job Opening & Criteria' : 'Create New Job Opening'}
              </h3>
              <p className="text-xs text-slate-500">
                Configure role requirements, mandatory skills, and candidate scoring weights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(85vh-120px)] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium border border-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Junior Python Developer"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="AI/ML Research">AI/ML Research</option>
                <option value="Business Intelligence">Business Intelligence</option>
                <option value="UI/UX Engineering">UI/UX Engineering</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Infrastructure">Infrastructure / Cloud</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Description & Role Summary *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline primary engineering responsibilities, project scope, and team expectations..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mandatory Required Skills (Comma-separated) *
              </label>
              <input
                type="text"
                value={formData.required_skills}
                onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                placeholder="e.g. Python, SQL, FastAPI"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Candidates missing these skills will be flagged or rejected</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Preferred / Nice-to-Have Skills
              </label>
              <input
                type="text"
                value={formData.preferred_skills}
                onChange={(e) => setFormData({ ...formData, preferred_skills: e.target.value })}
                placeholder="e.g. Docker, Git, Pandas, Linux"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Bonus skills contributing to overall fit percentage</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum Experience (Years)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.minimum_experience}
                onChange={(e) => setFormData({ ...formData, minimum_experience: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Education Requirement
              </label>
              <select
                value={formData.education_requirement}
                onChange={(e) => setFormData({ ...formData, education_requirement: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="BTech / BE / MCA">BTech / BE / MCA</option>
                <option value="BTech / BE / BCA / MCA">BTech / BE / BCA / MCA</option>
                <option value="BTech / BSc / Any Graduate">BTech / BSc / Any Graduate</option>
                <option value="MTech / MS / PhD">MTech / MS / PhD (Advanced)</option>
                <option value="Any Graduate">Any Degree / Graduate</option>
              </select>
            </div>
          </div>

          {/* Configurable Fit-Score Weights */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                Configurable Fit Scoring Weights
              </span>
              <span className={`text-xs font-bold ${weightTotal === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                Sum: {weightTotal}% {weightTotal !== 100 && '(Will be normalized to 100%)'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Skills Match (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.skill_weight}
                  onChange={(e) => setFormData({ ...formData, skill_weight: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 font-bold text-indigo-700 text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Experience (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.experience_weight}
                  onChange={(e) => setFormData({ ...formData, experience_weight: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 font-bold text-blue-700 text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Education (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.education_weight}
                  onChange={(e) => setFormData({ ...formData, education_weight: Number(e.target.value) })}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 font-bold text-emerald-700 text-center"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Listing Status
            </label>
            <div className="flex gap-4">
              {['Active', 'Draft', 'Closed'].map((st) => (
                <label key={st} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="job_status"
                    value={st}
                    checked={formData.status === st}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{st}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : (initialData ? 'Update Job Opening' : 'Publish Job Opening')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
