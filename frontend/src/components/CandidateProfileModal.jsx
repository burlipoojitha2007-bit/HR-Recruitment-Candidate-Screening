import React, { useState } from 'react';
import { 
  X, CheckCircle, AlertTriangle, XCircle, Briefcase, GraduationCap, 
  Clock, Mail, Phone, FileText, Check, Ban, Calendar, Sparkles, Award
} from 'lucide-react';
import { ScoreBadge, EligibilityBadge, StatusBadge } from './ScoreBadge';

export function CandidateProfileModal({ candidate, onClose, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(false);

  if (!candidate) return null;

  const handleAction = async (status) => {
    setActionLoading(true);
    try {
      await onStatusChange(candidate.application_id, status);
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
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 px-6 py-5 text-white">
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
                <p className="text-indigo-100 text-sm flex items-center gap-2 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Applied for: <span className="font-semibold text-white">{candidate.job_title || "General Role"}</span>
                  {candidate.department && <span className="text-indigo-200">({candidate.department})</span>}
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
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-indigo-100">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-200" />
              <span>{candidate.candidate_email}</span>
            </div>
            {candidate.candidate_phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-200" />
                <span>{candidate.candidate_phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-200" />
              <span>{candidate.education}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-200" />
              <span>{candidate.experience} yrs exp</span>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-medium text-slate-500">Eligibility:</span>
            <EligibilityBadge eligibility={candidate.eligibility} />
            <span className="text-slate-300">|</span>
            <span className="font-medium text-slate-500">Current Status:</span>
            <StatusBadge status={candidate.status} />
          </div>
          <div className="text-slate-500 font-medium">
            Recommended Action: <strong className="text-indigo-600 uppercase font-bold">{candidate.fit_score >= 75 ? 'SHORTLIST' : candidate.fit_score >= 50 ? 'MANUAL REVIEW' : 'REJECT'}</strong>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[calc(80vh-180px)] overflow-y-auto">
          
          {/* Top AI Score Hero Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-5 rounded-xl border border-slate-200/80">
            {/* Circular Gauge */}
            <div className="flex flex-col items-center justify-center p-3 text-center border-b md:border-b-0 md:border-r border-slate-200">
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="transparent"
                  />
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
                AI Fit Score
              </div>
            </div>

            {/* Breakdown Sub-Scores */}
            <div className="md:col-span-2 space-y-2.5 justify-center flex flex-col">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Scoring Breakdown (Weighted ADSA Matrix)
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

              {/* Experience 20% */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Experience Alignment (Weight: 20%)</span>
                  <span className="font-bold text-slate-800">{expScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${expScore}%` }}></div>
                </div>
              </div>

              {/* Education 15% */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Education Requirement (Weight: 15%)</span>
                  <span className="font-bold text-slate-800">{eduScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${eduScore}%` }}></div>
                </div>
              </div>

              {/* Preferred Skills 10% */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Preferred Skills (Weight: 10%)</span>
                  <span className="font-bold text-slate-800">{prefScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${prefScore}%` }}></div>
                </div>
              </div>

              {/* Keyword Relevance 5% */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Resume Keyword Relevance (Weight: 5%)</span>
                  <span className="font-bold text-slate-800">{keyScore}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${keyScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Decision Explanation */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex items-start gap-3">
            <Award className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Screening Assessment & Rationale</h4>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                {candidate.reason || "Profile meets criteria for current technical opening."}
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

          {/* Candidate Skills List */}
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
                Resume Content Preview
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
                {candidate.resume_text}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            Back to Candidates
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={actionLoading || candidate.status === "Rejected"}
              onClick={() => handleAction("Rejected")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              <Ban className="w-4 h-4" />
              Reject
            </button>

            <button
              type="button"
              disabled={actionLoading || candidate.status === "Interview"}
              onClick={() => handleAction("Interview")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              Schedule Interview
            </button>

            <button
              type="button"
              disabled={actionLoading || candidate.status === "Shortlisted"}
              onClick={() => handleAction("Shortlisted")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Shortlist Candidate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
