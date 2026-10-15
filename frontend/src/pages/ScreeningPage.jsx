import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, FileText, Sparkles, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, UserCheck, RefreshCw, FileUp, Award, ShieldCheck,
  Check, Ban, HelpCircle, Save, Info, Sliders, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreBadge, EligibilityBadge } from '../components/ScoreBadge';

export function ScreeningPage({ preselectedJobId, onSelectCandidate }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId ? String(preselectedJobId) : '');
  const [resumeText, setResumeText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [screeningResult, setScreeningResult] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Recruiter Decision Overrides & Notes state
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Sample Resumes for 1-click instantaneous demo
  const sampleResumes = [
    {
      label: "Sample 1: Strong Match (Rahul - AI/ML Intern)",
      text: `Rahul Sharma
Email: rahul.sharma@example.com
Phone: +91 98765 43210
Education: BTech Computer Science and Engineering
Experience: 1.5 years of experience

Summary:
Proficient AI Developer with hands-on experience building Machine Learning pipelines, Python scripting, SQL database architecture, FastAPI endpoints, Pandas, and Git version control. Built automated predictive inference systems.`
    },
    {
      label: "Sample 2: Review Needed (Priya - Python/SQL MCA)",
      text: `Priya Nair
Email: priya.nair@example.com
Phone: +91 98222 33445
Education: MCA (Master of Computer Applications)
Experience: 1.0 year experience

Technical Skills:
Python, SQL databases, Git, Linux, Flask web framework. Familiar with core programming concepts, eager to learn Machine Learning and FastAPI on the job.`
    },
    {
      label: "Sample 3: Not Eligible (Arjun - Frontend Fresher)",
      text: `Arjun Mehta
Email: arjun.mehta@example.com
Phone: +91 98444 55667
Education: BSc Information Technology
Experience: 0 years (Fresher)

Key Skills:
Java, HTML5, CSS3, WordPress, PHP. Enthusiastic learner seeking front-end or content roles.`
    }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getJobs();
        setJobs(data);
        if (!selectedJobId && data.length > 0) {
          const defaultJob = data.find(j => j.title.toLowerCase().includes('python')) || data[0];
          setSelectedJobId(String(defaultJob.job_id));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchJobs();
  }, [preselectedJobId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.uploadResume(formData);
      if (res.parsed_data) {
        setParsedData(res.parsed_data);
        setResumeText(res.parsed_data.resume_text || '');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to extract text from resume file.');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenResume = async () => {
    if (!selectedJobId) {
      setError('Please select a target Job Opening.');
      return;
    }
    if (!resumeText.trim()) {
      setError('Please upload a resume file or paste candidate resume text.');
      return;
    }

    setLoading(true);
    setError('');
    setActionSuccessMsg('');
    try {
      let currentParsed = parsedData;
      if (!currentParsed) {
        const formData = new FormData();
        formData.append('raw_text', resumeText);
        const parseRes = await api.uploadResume(formData);
        currentParsed = parseRes.parsed_data;
        setParsedData(currentParsed);
      }

      const screenRes = await api.screenCandidate({
        job_id: parseInt(selectedJobId),
        candidate_name: currentParsed.name,
        candidate_email: currentParsed.email,
        candidate_phone: currentParsed.phone,
        candidate_skills: currentParsed.skills,
        candidate_experience: currentParsed.experience,
        candidate_education: currentParsed.education,
        resume_text: resumeText,
        auto_save: true
      });

      setScreeningResult(screenRes);
      setRecruiterNotes('');
      setOverrideReason('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete candidate screening.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterDecision = async (status) => {
    if (!screeningResult?.application_id) {
      alert('Application record not yet saved in database.');
      return;
    }
    setActionLoading(true);
    try {
      await api.updateApplicationStatus(
        screeningResult.application_id, 
        status, 
        recruiterNotes, 
        overrideReason
      );
      setActionSuccessMsg(`Candidate successfully marked as "${status}". Decision recorded in audit log.`);
      setScreeningResult(prev => ({
        ...prev,
        status: status,
        recommended_action: status.toUpperCase()
      }));
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setActionLoading(false);
    }
  };

  const selectedJob = jobs.find(j => String(j.job_id) === String(selectedJobId));

  // Determine matched vs missing skills
  const matchedSkills = screeningResult?.matched_skills || [];
  const missingSkills = screeningResult?.missing_skills || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Deterministic Smart Screening Engine</h2>
          <p className="text-xs text-slate-500">
            Automated eligibility verification, configurable weighted scoring (50/30/20%), and human-in-the-loop decision support
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Zero-Bias Algorithm Active
          </span>
        </div>
      </div>

      {/* 5-Step Deterministic Screening Process Stepper */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          5-Step Deterministic Screening Architecture
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          
          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
            <div className="font-bold text-indigo-900 flex items-center justify-between">
              <span>Step 1: Rules</span>
              <span className="text-[10px] text-indigo-500 font-mono">01</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Check min education, experience & required skills</p>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
            <div className="font-bold text-blue-900 flex items-center justify-between">
              <span>Step 2: Eligibility</span>
              <span className="text-[10px] text-blue-500 font-mono">02</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Classify as Eligible, Needs Review, or Not Eligible</p>
          </div>

          <div className="p-2.5 rounded-xl bg-violet-50/60 border border-violet-100 flex flex-col justify-between">
            <div className="font-bold text-violet-900 flex items-center justify-between">
              <span>Step 3: Fit Score</span>
              <span className="text-[10px] text-violet-500 font-mono">03</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Compute 50% Skills, 30% Exp, 20% Edu (Normalized)</p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
            <div className="font-bold text-amber-900 flex items-center justify-between">
              <span>Step 4: Rank</span>
              <span className="text-[10px] text-amber-500 font-mono">04</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Priority sort eligible applicants by fit score</p>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
            <div className="font-bold text-emerald-900 flex items-center justify-between">
              <span>Step 5: Audit & Notes</span>
              <span className="text-[10px] text-emerald-500 font-mono">05</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Explain reasons, missing skills & recruiter override</p>
          </div>

        </div>
      </div>

      {/* Ethical AI & Fair Screening Compliance Banner */}
      <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs flex items-start gap-3 border border-slate-800">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white">Ethical AI & Fair Screening Guarantee:</span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            This screening system strictly excludes gender, religion, caste, age, disability, photographs, or personal demographics. 
            All scores are <strong>decision-support estimates</strong>—never absolute judgments of human worth. 
            Ambiguous records are flagged for manual review, and human recruiters retain full override authority.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Upload & Inputs on Left, Real-time Screening Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Resume Input (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Target Job Selection Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Target Job Opening *
              </label>
              {selectedJob && (
                <span className="text-[11px] font-semibold text-indigo-600">
                  Weights: {Math.round((selectedJob.skill_weight ?? 0.5) * 100)}% Skill / {Math.round((selectedJob.experience_weight ?? 0.3) * 100)}% Exp / {Math.round((selectedJob.education_weight ?? 0.2) * 100)}% Edu
                </span>
              )}
            </div>

            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {jobs.map((job) => (
                <option key={job.job_id} value={job.job_id}>
                  {job.title} — {job.department} (Req: {job.required_skills})
                </option>
              ))}
            </select>

            {selectedJob && (
              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1.5">
                <div className="font-semibold text-indigo-950 flex items-center justify-between">
                  <span>Job Requirements:</span>
                  <span className="text-[11px] font-normal text-indigo-700">Min Exp: {selectedJob.minimum_experience} yrs • {selectedJob.education_requirement}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong className="text-slate-800">Mandatory Skills:</strong> {selectedJob.required_skills}
                </div>
                {selectedJob.preferred_skills && (
                  <div className="text-slate-600 text-[11px]">
                    <strong className="text-slate-800">Preferred Skills:</strong> {selectedJob.preferred_skills}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Demo Resume Samples */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Quick Load Demo Resumes
              </span>
              <span className="text-[10px] text-slate-400">Click to auto-fill sample text</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleResumes.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setResumeText(sample.text);
                    setUploadedFile(null);
                    setParsedData(null);
                    setScreeningResult(null);
                    setActionSuccessMsg('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-colors cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Upload or Paste Area */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Resume Document or Text *
              </label>
              <span className="text-[11px] text-slate-400">Supports PDF & TXT</span>
            </div>

            {/* Drag & Drop File Upload */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="w-8 h-8 text-indigo-500" />
                <div className="text-xs font-semibold text-slate-700">
                  {uploadedFile ? (
                    <span className="text-indigo-600 font-bold">{uploadedFile.name}</span>
                  ) : (
                    <span>Click to browse or drag & drop resume (PDF / TXT)</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  Built-in parser extracts contact info, education, years of experience, and technical skills
                </p>
              </div>
            </div>

            {/* Paste Text Fallback */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-600">Or Paste Resume Text Directly:</span>
                {resumeText && (
                  <button
                    onClick={() => { setResumeText(''); setParsedData(null); setScreeningResult(null); }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Clear Text
                  </button>
                )}
              </div>
              <textarea
                rows={6}
                placeholder="Paste candidate resume content here..."
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setParsedData(null);
                }}
                className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
            </div>

            {/* Execute Screening Button */}
            <button
              onClick={handleScreenResume}
              disabled={loading || !resumeText.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              {loading ? 'Evaluating Eligibility & Calculating Fit Score...' : 'Run Screening & Calculate Job Fit'}
            </button>
          </div>

        </div>

        {/* Right Column: Instant Screening Results & Recruiter Decision Support (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {screeningResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-5 animate-fade-in">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Screening Decision Support
                  </h3>
                  <p className="text-xs text-slate-500">{screeningResult.candidate_name || 'Evaluated Candidate'}</p>
                </div>
                <EligibilityBadge eligibility={screeningResult.eligibility} />
              </div>

              {/* Big Score Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    Calculated Job-Fit Score
                  </span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {Math.round(screeningResult.fit_score)}%
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Recommendation: <span className="text-indigo-600 font-bold">{screeningResult.recommended_action}</span>
                  </div>
                </div>

                <div className="w-14 h-14 rounded-full bg-white shadow-xs border border-indigo-200 flex items-center justify-center">
                  <Award className="w-7 h-7 text-indigo-600" />
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="space-y-3 text-xs">
                {/* Matched Skills */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Matched Technical Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(matchedSkills.length > 0 ? matchedSkills : (screeningResult.candidate_skills || '').split(',')).map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        ✓ {typeof sk === 'string' ? sk.trim() : sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                {missingSkills.length > 0 ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                    <div className="font-bold text-rose-900 flex items-center gap-1.5 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Missing Required Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700">
                          ✕ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    All mandatory job skills fulfilled!
                  </div>
                )}
              </div>

              {/* Score Sub-components */}
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-700 uppercase tracking-wide text-[10px] flex items-center justify-between">
                  <span>Score Breakdown Formula</span>
                  <span className="font-mono text-slate-400 text-[10px]">ADSA Weighted</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Skills Match (50%):</span>
                    <span className="font-bold">{screeningResult.skills_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${screeningResult.skills_score}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Relevant Experience (30%):</span>
                    <span className="font-bold">{screeningResult.experience_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${screeningResult.experience_score}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Education Match (20%):</span>
                    <span className="font-bold">{screeningResult.education_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${screeningResult.education_score}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Recommendation Explanation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Explainable Decision Rationale
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {screeningResult.reason}
                </p>
              </div>

              {/* Recruiter Review Actions (Shortlist, Needs Review, Not Selected) */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Recruiter Decision & Manual Override
                </div>

                {actionSuccessMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{actionSuccessMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRecruiterDecision('Shortlisted')}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Shortlist
                  </button>

                  <button
                    onClick={() => handleRecruiterDecision('Review')}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Needs Review
                  </button>

                  <button
                    onClick={() => handleRecruiterDecision('Rejected')}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Not Selected
                  </button>
                </div>

                {/* Recruiter Notes & Override Reason */}
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    placeholder="Recruiter notes (e.g., strong coursework, interview notes)..."
                    value={recruiterNotes}
                    onChange={(e) => setRecruiterNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Reason for manual override (if changing AI recommendation)..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

            </div>
          ) : (
            /* Standby Card */
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Awaiting Resume Input</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  Upload a PDF/TXT resume or select one of the 3 preloaded candidate samples on the left to see instant deterministic scoring.
                </p>
              </div>

              {parsedData && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 mt-4">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Extracted Resume Metadata
                  </div>
                  <div><strong>Name:</strong> {parsedData.name}</div>
                  <div><strong>Email:</strong> {parsedData.email}</div>
                  <div><strong>Education:</strong> {parsedData.education}</div>
                  <div><strong>Experience:</strong> {parsedData.experience} years</div>
                  <div><strong>Detected Skills:</strong> {parsedData.skills}</div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
