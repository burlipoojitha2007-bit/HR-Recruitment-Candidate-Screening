import React, { useState } from 'react';
import { 
  X, CheckCircle, CheckCircle2, AlertTriangle, XCircle, Briefcase, GraduationCap, 
  Clock, Mail, Phone, FileText, Check, Ban, Calendar, Sparkles, Award,
  MessageSquare, Save, Edit3, HelpCircle, ShieldCheck, History, ArrowRight
} from 'lucide-react';
import { ScoreBadge, EligibilityBadge, StatusBadge } from './ScoreBadge';
import { api } from '../services/api';

export function CandidateProfileModal({ candidate, onClose, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'notes', 'timeline'
  const [actionLoading, setActionLoading] = useState(false);
  const [recruiterNotes, setRecruiterNotes] = useState(candidate?.recruiter_notes || '');
  const [overrideReason, setOverrideReason] = useState(candidate?.override_reason || '');
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [targetOverrideStatus, setTargetOverrideStatus] = useState('Shortlisted');
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  if (!candidate) return null;

  const handleAction = async (newStatus) => {
    // If setting a status that differs significantly from AI recommendation, allow direct or prompt override
    setActionLoading(true);
    try {
      await api.updateApplicationStatus(candidate.application_id, newStatus, recruiterNotes, overrideReason);
      if (onStatusChange) {
        onStatusChange(candidate.application_id, newStatus);
      }
    } catch (err) {
      alert(err.message || 'Error updating candidate status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setActionLoading(true);
    try {
      await api.updateCandidateNotes(candidate.application_id, recruiterNotes, overrideReason);
      setNotesSavedNotice(true);
      setTimeout(() => setNotesSavedNotice(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save notes');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmOverride = async () => {
    if (!overrideReason.trim()) {
      alert('Please provide a recorded justification reason for the manual decision override.');
      return;
    }
    setActionLoading(true);
    try {
      await api.updateApplicationStatus(
        candidate.application_id,
        targetOverrideStatus,
        recruiterNotes,
        overrideReason.trim()
      );
      if (onStatusChange) {
        onStatusChange(candidate.application_id, targetOverrideStatus);
      }
      setShowOverrideModal(false);
    } catch (err) {
      alert(err.message || 'Failed to record override');
    } finally {
      setActionLoading(false);
    }
  };

  const fitScore = Math.round(candidate.fit_score || 0);
  const skillsScore = Math.round(candidate.skills_score || 0);
  const expScore = Math.round(candidate.experience_score || 0);
  const eduScore = Math.round(candidate.education_score || 0);
  const prefScore = Math.round(candidate.preferred_skills_score || 0);
  const keyScore = Math.round(candidate.keyword_score || 0);

  const missingSkillsList = Array.isArray(candidate.missing_skills)
    ? candidate.missing_skills
    : (candidate.missing_skills ? candidate.missing_skills.split(',').map(s => s.trim()).filter(Boolean) : []);

  const candidateSkillsList = (candidate.skills || "")
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const getGaugeColor = (score) => {
    if (score >= 75) return '#10b981'; // emerald
    if (score >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in my-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                {candidate.candidate_name ? candidate.candidate_name.charAt(0) : 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{candidate.candidate_name}</h2>
                  {candidate.rank && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                      Rank #{candidate.rank}
                    </span>
                  )}
                </div>
                <p className="text-indigo-200 text-xs flex items-center gap-2 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Applied for: <span className="font-semibold text-white">{candidate.job_title || "General Role"}</span>
                  {candidate.department && <span className="text-indigo-300">({candidate.department})</span>}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick contact pills */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-indigo-200">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-300" />
              <span>{candidate.candidate_email}</span>
            </div>
            {candidate.candidate_phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-300" />
                <span>{candidate.candidate_phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              <span>{candidate.education}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>{candidate.experience} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-50 px-6 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Scoring
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Recruiter Notes & Overrides
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`py-3 font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Recruitment Timeline
            </button>
          </div>

          <div className="flex items-center gap-2">
            <EligibilityBadge eligibility={candidate.eligibility} />
            <StatusBadge status={candidate.status} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(80vh-180px)] overflow-y-auto">
          
          {/* TAB 1: OVERVIEW & SCORING */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top AI Score Hero Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-5 rounded-xl border border-slate-200/80">
                {/* Circular Gauge */}
                <div className="flex flex-col items-center justify-center p-3 text-center border-b md:border-b-0 md:border-r border-slate-200">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="46" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="56"
                        cy="56"
                        r="46"
                        stroke={getGaugeColor(fitScore)}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 46}
                        strokeDashoffset={2 * Math.PI * 46 * (1 - fitScore / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold text-slate-900">{fitScore}</span>
                      <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">/ 100</span>
                    </div>
                  </div>
                  <div className="mt-2 font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Job-Fit Score
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Decision-Support Estimate</div>
                </div>

                {/* Breakdown Sub-Scores */}
                <div className="md:col-span-2 space-y-2.5 justify-center flex flex-col">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Configurable Scoring Breakdown</span>
                    <span className="text-[11px] text-indigo-600 font-bold">Sum: 100% Normalized</span>
                  </div>

                  {/* Skills Match 50% */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Skills Match (Weight: 50%)</span>
                      <span className="font-bold text-slate-800">{skillsScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skillsScore}%` }}></div>
                    </div>
                  </div>

                  {/* Experience 30% */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Relevant Experience (Weight: 30%)</span>
                      <span className="font-bold text-slate-800">{expScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${expScore}%` }}></div>
                    </div>
                  </div>

                  {/* Education 20% */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">Education Match (Weight: 20%)</span>
                      <span className="font-bold text-slate-800">{eduScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${eduScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Rationale */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start gap-3">
                <Award className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Screening Assessment & Rationale</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {candidate.reason || "Profile meets eligibility threshold criteria for role specifications."}
                  </p>
                </div>
              </div>

              {/* Missing Skills Warning */}
              {missingSkillsList.length > 0 ? (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wide mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Missing Required Skills:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkillsList.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                        ✕ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  All mandatory skills matched for this job opening!
                </div>
              )}

              {/* Verified Candidate Skills */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidate Skills Verified</h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidateSkillsList.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Text Snippet */}
              {candidate.resume_text && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    Resume Document Preview
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                    {candidate.resume_text}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RECRUITER NOTES & OVERRIDES */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              {notesSavedNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recruiter notes saved successfully.</span>
                </div>
              )}

              {/* Override Banner if applied */}
              {candidate.override_reason && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Manual Recruiter Override Recorded:
                  </div>
                  <p className="text-xs text-amber-800 mt-1 italic">
                    "{candidate.override_reason}"
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recruiter Evaluation Notes
                </label>
                <textarea
                  rows={4}
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                  placeholder="Record interview notes, technical screening feedback, soft skills evaluation, or candidate preferences..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Override System Decision
                </button>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {actionLoading ? 'Saving...' : 'Save Recruiter Notes'}
                </button>
              </div>

              {/* Ethical Decision Support Callout */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Ethical AI Governance Notice
                </div>
                <p>
                  Scores in this system are decision-support estimates based strictly on skill overlaps, declared education, and relevant experience.
                  Personal demographic attributes (gender, age, religion, disability) are never collected or scored.
                  Recruiters retain full final authority to override automated classifications.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RECRUITMENT TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Application History & Lifecycle
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Event 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-200"></div>
                  <div className="text-xs font-bold text-slate-800">Application Received</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Candidate profile submitted and validated in recruitment database.
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white ring-2 ring-indigo-200"></div>
                  <div className="text-xs font-bold text-slate-800">Deterministic Screening Completed</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Evaluated against job specifications. Calculated Fit Score: <strong className="text-indigo-600">{fitScore}%</strong>.
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                    candidate.eligibility === 'Eligible' ? 'bg-emerald-500 ring-emerald-200' :
                    candidate.eligibility === 'Review' ? 'bg-amber-500 ring-amber-200' :
                    'bg-rose-500 ring-rose-200'
                  }`}></div>
                  <div className="text-xs font-bold text-slate-800">Eligibility Classification: {candidate.eligibility}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {candidate.reason || "Evaluated by DMGT Set-theoretic and ADSA scoring rules."}
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-400 border-2 border-white ring-2 ring-slate-200"></div>
                  <div className="text-xs font-bold text-slate-800">Current Decision Status: {candidate.status}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {candidate.override_reason
                      ? `Recruiter Override: ${candidate.override_reason}`
                      : 'Candidate profile active in recruitment funnel.'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Close View
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={actionLoading || candidate.status === "Rejected"}
              onClick={() => handleAction("Rejected")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              <Ban className="w-3.5 h-3.5" />
              Not Selected
            </button>

            <button
              type="button"
              disabled={actionLoading || candidate.status === "Review"}
              onClick={() => handleAction("Review")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5" />
              Needs Review
            </button>

            <button
              type="button"
              disabled={actionLoading || candidate.status === "Shortlisted"}
              onClick={() => handleAction("Shortlisted")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              Shortlist Candidate
            </button>
          </div>
        </div>

        {/* Manual Override Modal Dialog */}
        {showOverrideModal && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Manual Decision Override
                </div>
                <button onClick={() => setShowOverrideModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                You are overriding the system recommendation for <strong>{candidate.candidate_name}</strong>. Please select the target status and provide a mandatory recorded reason.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Status</label>
                <select
                  value={targetOverrideStatus}
                  onChange={(e) => setTargetOverrideStatus(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Schedule Interview</option>
                  <option value="Review">Needs Review</option>
                  <option value="Rejected">Not Selected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recorded Override Justification *
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Demonstrated exceptional problem-solving skills in screening interview; portfolio compensates for experience gap..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOverride}
                  disabled={actionLoading}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs"
                >
                  Confirm Override
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
