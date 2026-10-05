import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertTriangle, Sparkles, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Candidate, Job, DegreeLevel, CandidateStatus } from '../types';
import { JavaEligibilityFilter } from '../services/eligibilityService';
import { PythonFitClassifier } from '../services/fitScoreService';
import { ScoreGauge } from './ScoreGauge';
import { AcademicBadge } from './AcademicBadge';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidateData: any) => void;
  candidateToEdit?: Candidate | null;
  jobs: Job[];
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  candidateToEdit,
  jobs
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>('Bachelors');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3.0);
  const [location, setLocation] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [appliedJobId, setAppliedJobId] = useState<number>(jobs[0]?.id || 201);
  const [status, setStatus] = useState<CandidateStatus>('Applied');
  const [notes, setNotes] = useState('');

  // Prepopulate if editing
  useEffect(() => {
    if (candidateToEdit) {
      setFullName(candidateToEdit.fullName);
      setEmail(candidateToEdit.email);
      setPhone(candidateToEdit.phone);
      setEducation(candidateToEdit.education);
      setDegreeLevel(candidateToEdit.degreeLevel);
      setSkills([...candidateToEdit.skills]);
      setYearsOfExperience(candidateToEdit.yearsOfExperience);
      setLocation(candidateToEdit.location);
      setResumeText(candidateToEdit.resumeText);
      setAppliedJobId(candidateToEdit.appliedJobId);
      setStatus(candidateToEdit.status);
      setNotes(candidateToEdit.notes || '');
    } else {
      setFullName('');
      setEmail('');
      setPhone('');
      setEducation('');
      setDegreeLevel('Bachelors');
      setSkills(['Python', 'SQL', 'React']);
      setYearsOfExperience(3.0);
      setLocation('Bangalore, India');
      setResumeText('');
      setAppliedJobId(jobs[0]?.id || 201);
      setStatus('Applied');
      setNotes('');
    }
  }, [candidateToEdit, isOpen, jobs]);

  if (!isOpen) return null;

  const selectedJob = jobs.find(j => j.id === appliedJobId) || jobs[0];

  // Calculate live preview metrics
  const previewCandidate: Partial<Candidate> = {
    fullName,
    email,
    education,
    degreeLevel,
    skills,
    yearsOfExperience,
    resumeText,
    appliedJobId
  };

  const liveEligibility = selectedJob ? JavaEligibilityFilter.evaluate(previewCandidate, selectedJob) : null;
  const liveFitScore = selectedJob ? PythonFitClassifier.calculateFitScore(previewCandidate, selectedJob) : null;

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.map(s => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !selectedJob) return;

    onSave({
      ...(candidateToEdit ? { id: candidateToEdit.id } : {}),
      fullName,
      email,
      phone,
      education,
      degreeLevel,
      skills,
      yearsOfExperience: Number(yearsOfExperience),
      location,
      resumeText: resumeText || `Professional with skills in ${skills.join(', ')} and ${yearsOfExperience} years of experience.`,
      appliedJobId,
      status,
      applicationDate: candidateToEdit ? candidateToEdit.applicationDate : new Date().toISOString().split('T')[0],
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                {candidateToEdit ? 'Edit Candidate Profile' : 'Add New Candidate'}
              </h2>
              <AcademicBadge subject="Java" size="sm" showLabel={false} />
              <AcademicBadge subject="Python" size="sm" showLabel={false} />
            </div>
            <p className="text-xs text-slate-500">
              {candidateToEdit
                ? `Updating ID #${candidateToEdit.id} – Re-evaluating eligibility predicates & fit scores`
                : 'Intake new applicant resume with automated Java rule verification'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Split View (Form on Left, Live Engine on Right) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Target Job Requisition */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Job Requisition <span className="text-red-500">*</span>
              </label>
              <select
                value={appliedJobId}
                onChange={e => setAppliedJobId(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.department}) – Min {j.minimumExperience} yrs exp
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Sharma"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Bangalore, India"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Education & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Education Credential <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science, IIT"
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Level</label>
                <select
                  value={degreeLevel}
                  onChange={e => setDegreeLevel(e.target.value as DegreeLevel)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience (Years): <strong className="text-blue-600 font-bold">{yearsOfExperience} yrs</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={yearsOfExperience}
                  onChange={e => setYearsOfExperience(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ATS Pipeline Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as CandidateStatus)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Applied">Applied</option>
                  <option value="Eligible">Eligible</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Skills Tag Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Skills List (Required by Java & Python)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type a skill and press Enter (e.g. Python, SQL)"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 text-xs rounded-xl border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                {skills.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No skills added yet</span>
                )}
                {skills.map(s => {
                  const isReq = selectedJob?.requiredSkills.some(req => req.toLowerCase() === s.toLowerCase());
                  return (
                    <span
                      key={s}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        isReq
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {s}
                      {isReq && <span className="text-[10px] text-blue-600 font-bold" title="Matches Job Requirement">★</span>}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-slate-400 hover:text-red-500 ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Resume Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resume Summary / Text Content (Used for Python Cosine Similarity)
              </label>
              <textarea
                rows={3}
                placeholder="Paste candidate resume overview or project highlights..."
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              />
            </div>
          </div>

          {/* Right Panel: Live Academic Evaluation Engine (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200 p-4 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Live Screening Preview
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                Real-time
              </span>
            </div>

            {/* 1. Java Eligibility Module Card */}
            <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <AcademicBadge subject="Java" size="sm" showLabel={false} />
                  Eligibility Filter
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    liveEligibility?.isEligible
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {liveEligibility?.isEligible ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Eligible
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Not Eligible
                    </>
                  )}
                </span>
              </div>

              {!liveEligibility?.isEligible && liveEligibility?.reasons && liveEligibility.reasons.length > 0 && (
                <div className="p-2 bg-rose-50 border border-rose-100 rounded-lg text-[11px] text-rose-800 space-y-1">
                  <p className="font-semibold text-rose-900">Eligibility Violations:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {liveEligibility.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {liveEligibility?.isEligible && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  ✓ Meets all mandatory skills, minimum experience ({selectedJob?.minimumExperience} yrs), and education requirements.
                </p>
              )}

              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                Job Requires: <strong className="text-slate-700">{selectedJob?.requiredSkills.join(', ')}</strong>
              </div>
            </div>

            {/* 2. Python Fit-Score Classifier Card */}
            <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <AcademicBadge subject="Python" size="sm" showLabel={false} />
                  Fit Score Engine
                </span>
                {liveFitScore && (
                  <ScoreGauge score={liveFitScore.total} category={liveFitScore.category} size="sm" />
                )}
              </div>

              {liveFitScore && (
                <div className="space-y-2 text-xs">
                  {/* Skills Match 50% */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Skills Match (50% wt)</span>
                      <span className="font-bold text-slate-800">{liveFitScore.skillsMatch} / 50 pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${(liveFitScore.skillsMatch / 50) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Experience Match 25% */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Experience Match (25% wt)</span>
                      <span className="font-bold text-slate-800">{liveFitScore.experienceMatch} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${(liveFitScore.experienceMatch / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Education Match 15% */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Education Match (15% wt)</span>
                      <span className="font-bold text-slate-800">{liveFitScore.educationMatch} / 15 pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${(liveFitScore.educationMatch / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* JD Similarity 10% */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                      <span>Resume/JD Cosine Sim (10% wt)</span>
                      <span className="font-bold text-slate-800">{liveFitScore.descriptionSimilarity} / 10 pts</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${(liveFitScore.descriptionSimilarity / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ADDSA B-Tree Index Tip */}
            <div className="p-2.5 bg-purple-50/80 border border-purple-100 rounded-xl text-[11px] text-purple-900 flex items-start gap-2">
              <AcademicBadge subject="ADDSA" size="sm" showLabel={false} />
              <p className="leading-tight text-[11px]">
                Upon saving, candidate record is indexed into the B-Tree at key <code className="font-mono font-bold">#{candidateToEdit?.id || 'NEXT_ID'}</code> for O(log N) search.
              </p>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="lg:col-span-12 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{candidateToEdit ? 'Save Changes' : 'Register & Screen Candidate'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
