import React, { useState, useEffect } from 'react';
import { X, UserPlus, UploadCloud, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { api } from '../services/api';

export function AddCandidateModal({ isOpen, onClose, onCandidateAdded, jobs = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: 'BTech Computer Science',
    experience: 1,
    skills: '',
    job_id: '',
    resume_text: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        education: 'BTech Computer Science',
        experience: 1,
        skills: '',
        job_id: jobs.length > 0 ? String(jobs[0].job_id) : '',
        resume_text: ''
      });
      setValidationErrors({});
      setServerError('');
    }
  }, [isOpen, jobs]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email format (e.g., name@example.com)';
    }

    if (formData.phone && !/^[0-9+\s-]{8,20}$/.test(formData.phone.trim())) {
      errors.phone = 'Please provide a valid contact number';
    }

    if (!formData.education.trim()) {
      errors.education = 'Education credential is required';
    }

    if (formData.experience === '' || isNaN(formData.experience) || Number(formData.experience) < 0) {
      errors.experience = 'Experience must be a positive number of years (or 0 for freshers)';
    }

    if (!formData.skills.trim()) {
      errors.skills = 'Please enter at least one technical skill (comma-separated)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setServerError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.uploadResume(data);
      if (res.parsed_data) {
        setFormData(prev => ({
          ...prev,
          name: res.parsed_data.name || prev.name,
          email: res.parsed_data.email || prev.email,
          phone: res.parsed_data.phone || prev.phone,
          education: res.parsed_data.education || prev.education,
          experience: res.parsed_data.experience !== undefined ? res.parsed_data.experience : prev.experience,
          skills: res.parsed_data.skills ? res.parsed_data.skills.join(', ') : prev.skills,
          resume_text: res.parsed_data.resume_text || prev.resume_text
        }));
      }
    } catch (err) {
      setServerError('Resume parsing failed: ' + (err.message || 'File unreadable'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError('');
    try {
      // 1. Create or screen candidate
      if (formData.job_id) {
        await api.screenCandidate({
          job_id: parseInt(formData.job_id),
          candidate_name: formData.name.trim(),
          candidate_email: formData.email.trim(),
          candidate_phone: formData.phone.trim(),
          candidate_education: formData.education.trim(),
          candidate_experience: parseFloat(formData.experience),
          candidate_skills: formData.skills.trim(),
          resume_text: formData.resume_text.trim(),
          auto_save: true
        });
      } else {
        await api.createCandidate({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          education: formData.education.trim(),
          experience: parseFloat(formData.experience),
          skills: formData.skills.trim(),
          resume_text: formData.resume_text.trim()
        });
      }

      if (onCandidateAdded) onCandidateAdded();
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to register candidate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add New Candidate Profile</h3>
              <p className="text-xs text-slate-500">Register applicant record and link with screening workflow</p>
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
          {serverError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Quick Resume Upload Autofill */}
          <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <UploadCloud className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-indigo-950">Optional: Autofill from Resume File</div>
                <div className="text-[11px] text-slate-500">Upload PDF/TXT resume to extract name, email, skills, and experience</div>
              </div>
            </div>
            <label className="cursor-pointer shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors shadow-2xs">
              {uploading ? 'Extracting...' : 'Upload Resume File'}
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  validationErrors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.name && (
                <span className="text-[11px] text-rose-600 mt-0.5 block">{validationErrors.name}</span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rahul.sharma@example.com"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  validationErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.email && (
                <span className="text-[11px] text-rose-600 mt-0.5 block">{validationErrors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  validationErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.phone && (
                <span className="text-[11px] text-rose-600 mt-0.5 block">{validationErrors.phone}</span>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Years of Experience *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  validationErrors.experience ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {validationErrors.experience && (
                <span className="text-[11px] text-rose-600 mt-0.5 block">{validationErrors.experience}</span>
              )}
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Education Qualification *
              </label>
              <select
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="BTech Computer Science">BTech / BE Computer Science</option>
                <option value="BTech Information Technology">BTech / BE Information Technology</option>
                <option value="MTech Computer Science">MTech Computer Science</option>
                <option value="MCA">MCA (Master of Computer Applications)</option>
                <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                <option value="BSc Computer Science">BSc Computer Science / IT</option>
                <option value="BTech Mechanical Engineering">BTech Other Specialization</option>
                <option value="Any Graduate">Other Graduate Degree</option>
              </select>
            </div>

            {/* Applied Job */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Job Opening *
              </label>
              <select
                value={formData.job_id}
                onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {jobs.map(j => (
                  <option key={j.job_id} value={j.job_id}>
                    {j.title} ({j.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Technical Skills (Comma-separated) *
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. Python, SQL, Machine Learning, FastAPI, Git, Pandas"
              className={`w-full px-3 py-2 text-xs rounded-lg border ${
                validationErrors.skills ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {validationErrors.skills && (
              <span className="text-[11px] text-rose-600 mt-0.5 block">{validationErrors.skills}</span>
            )}
          </div>

          {/* Resume Text / Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Resume Text / Summary (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.resume_text}
              onChange={(e) => setFormData({ ...formData, resume_text: e.target.value })}
              placeholder="Candidate summary, project highlights, technical achievements..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Actions */}
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
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {submitting ? 'Registering...' : 'Save & Screen Candidate'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
