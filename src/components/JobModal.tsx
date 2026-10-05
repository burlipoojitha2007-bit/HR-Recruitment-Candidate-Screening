import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Briefcase } from 'lucide-react';
import { Job, DegreeLevel } from '../types';
import { AcademicBadge } from './AcademicBadge';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
  jobToEdit?: Job | null;
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  jobToEdit
}) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [minimumExperience, setMinimumExperience] = useState<number>(3.0);
  const [educationRequirement, setEducationRequirement] = useState('');
  const [minDegreeLevel, setMinDegreeLevel] = useState<DegreeLevel>('Bachelors');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [status, setStatus] = useState<'Active' | 'Closed' | 'Draft'>('Active');
  const [salaryRange, setSalaryRange] = useState('$80,000 - $110,000');

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setDepartment(jobToEdit.department);
      setRequiredSkills([...jobToEdit.requiredSkills]);
      setPreferredSkills([...(jobToEdit.preferredSkills || [])]);
      setMinimumExperience(jobToEdit.minimumExperience);
      setEducationRequirement(jobToEdit.educationRequirement);
      setMinDegreeLevel(jobToEdit.minDegreeLevel);
      setJobDescription(jobToEdit.jobDescription);
      setLocation(jobToEdit.location);
      setStatus(jobToEdit.status);
      setSalaryRange(jobToEdit.salaryRange || '');
    } else {
      setTitle('');
      setDepartment('Engineering');
      setRequiredSkills(['Python', 'SQL']);
      setPreferredSkills(['Docker', 'AWS']);
      setMinimumExperience(3.0);
      setEducationRequirement('B.Tech or B.S. in Computer Science or related field');
      setMinDegreeLevel('Bachelors');
      setJobDescription('');
      setLocation('Bangalore / Hybrid');
      setStatus('Active');
      setSalaryRange('$80,000 - $110,000');
    }
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddReqSkill = () => {
    const trimmed = reqSkillInput.trim();
    if (trimmed && !requiredSkills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setReqSkillInput('');
    }
  };

  const handleAddPrefSkill = () => {
    const trimmed = prefSkillInput.trim();
    if (trimmed && !preferredSkills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setPreferredSkills([...preferredSkills, trimmed]);
      setPrefSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || requiredSkills.length === 0) return;

    onSave({
      ...(jobToEdit ? { id: jobToEdit.id } : {}),
      title,
      department,
      requiredSkills,
      preferredSkills,
      minimumExperience: Number(minimumExperience),
      educationRequirement: educationRequirement || `${minDegreeLevel} in Computer Science or related field`,
      minDegreeLevel,
      jobDescription: jobDescription || `Seeking talented ${title} to join ${department}.`,
      location,
      status,
      salaryRange,
      postedDate: jobToEdit ? jobToEdit.postedDate : new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {jobToEdit ? 'Edit Job Requisition' : 'Create Job Opening'}
              </h2>
              <AcademicBadge subject="DBMS" size="sm" showLabel={false} />
            </div>
            <p className="text-xs text-slate-500">
              {jobToEdit
                ? `Editing Requisition ID #${jobToEdit.id} – Updates will trigger automatic re-evaluation of applicant eligibility`
                : 'Define core technical requirements, minimum experience, and qualifications'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Backend Engineer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product Experience">Product Experience</option>
                <option value="AI Research & Data Science">AI Research & Data Science</option>
                <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                <option value="Business Intelligence">Business Intelligence</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Experience: <strong className="text-blue-600">{minimumExperience} yrs</strong>
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={minimumExperience}
                onChange={e => setMinimumExperience(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Degree</label>
              <select
                value={minDegreeLevel}
                onChange={e => setMinDegreeLevel(e.target.value as DegreeLevel)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Diploma">Diploma</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Requisition Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
              >
                <option value="Active">Active (Accepting Resumes)</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Education Requirement Text
            </label>
            <input
              type="text"
              placeholder="e.g. B.Tech / M.S. in Computer Science or IT"
              value={educationRequirement}
              onChange={e => setEducationRequirement(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Mandatory Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mandatory Required Skills <span className="text-red-500">* (Evaluated by Java Filter)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type mandatory skill and press Enter (e.g. Java, Spring Boot)"
                value={reqSkillInput}
                onChange={e => setReqSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddReqSkill();
                  }
                }}
                className="flex-1 text-xs rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddReqSkill}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {requiredSkills.length === 0 && (
                <span className="text-xs text-rose-500">At least one required skill is mandatory</span>
              )}
              {requiredSkills.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 font-semibold"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => setRequiredSkills(requiredSkills.filter(item => item !== s))}
                    className="text-blue-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Skills (Optional – Boosts Python Fit Score)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Type preferred skill and press Enter (e.g. Docker, Kafka)"
                value={prefSkillInput}
                onChange={e => setPrefSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPrefSkill();
                  }
                }}
                className="flex-1 text-xs rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddPrefSkill}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              {preferredSkills.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 border border-slate-300 font-medium"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => setPreferredSkills(preferredSkills.filter(item => item !== s))}
                    className="text-slate-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad / Hybrid"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range / CTC</label>
              <input
                type="text"
                placeholder="e.g. ₹25 - ₹35 LPA / $90k - $120k"
                value={salaryRange}
                onChange={e => setSalaryRange(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description (Used for Python TF-IDF Semantic Similarity)
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detailed description of responsibilities, technical expectations, and company domain..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{jobToEdit ? 'Save Changes' : 'Publish Requisition'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
