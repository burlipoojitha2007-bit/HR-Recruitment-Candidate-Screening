import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, FileText, Sparkles, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, UserCheck, RefreshCw, FileUp, Award
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

  // Sample Resumes for 1-click instantaneous demo
  const sampleResumes = [
    {
      label: "Sample A: Strong Match (Rahul - AI/ML)",
      text: `Rahul Sharma
Email: rahul.sharma@example.com
Phone: +91 98765 43210
Education: BTech Computer Science and Engineering
Experience: 1.5 years of experience

Summary:
Proficient AI Developer with expertise in Python, Machine Learning models, SQL database architecture, FastAPI endpoints, Pandas, and Git version control. Built automated predictive inference systems.`
    },
    {
      label: "Sample B: Moderate Match (Priya - Python/SQL)",
      text: `Priya Nair
Email: priya.nair@example.com
Phone: +91 98222 33445
Education: MCA (Master of Computer Applications)
Experience: 1 year experience

Technical Skills:
Python, SQL databases, Git, Linux, Flask web framework. Missing experience in Machine Learning and FastAPI.`
    },
    {
      label: "Sample C: Low Match / Rejected (Arjun - Java/HTML)",
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
          // Default to AI/ML Intern or first job
          const defaultJob = data.find(j => j.title.toLowerCase().includes('ai/ml')) || data[0];
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
    try {
      // 1. If parsedData not ready, extract from raw text first
      let currentParsed = parsedData;
      if (!currentParsed) {
        const formData = new FormData();
        formData.append('raw_text', resumeText);
        const parseRes = await api.uploadResume(formData);
        currentParsed = parseRes.parsed_data;
        setParsedData(currentParsed);
      }

      // 2. Send to Candidate Screening Engine
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
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete candidate screening.');
    } finally {
      setLoading(false);
    }
  };

  const selectedJob = jobs.find(j => String(j.job_id) === String(selectedJobId));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Interactive Resume Screening Engine</h2>
        <p className="text-xs text-slate-500">
          Upload PDF/TXT resumes or paste text. The system automatically extracts entities and matches against job criteria.
        </p>
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
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Target Job Opening *
            </label>
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
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                <div className="font-semibold text-indigo-950 flex items-center justify-between">
                  <span>Job Requirements:</span>
                  <span className="text-[11px] font-normal text-indigo-700">Min Exp: {selectedJob.minimum_experience} yrs</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong className="text-slate-800">Required:</strong> {selectedJob.required_skills}
                </div>
                {selectedJob.preferred_skills && (
                  <div className="text-slate-600 text-[11px]">
                    <strong className="text-slate-800">Preferred:</strong> {selectedJob.preferred_skills}
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
              <span className="text-[10px] text-slate-400">Click to auto-fill</span>
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
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-colors"
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
                  Built-in PyPDF parser automatically detects contact, education, experience, and skills
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
                rows={7}
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
              {loading ? 'Analyzing & Scoring Resume...' : 'Analyze & Screen Candidate'}
            </button>
          </div>

        </div>

        {/* Right Column: Instant Screening Results & Entity Extraction (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {screeningResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md space-y-6 animate-fade-in">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Screening Evaluation
                  </h3>
                  <p className="text-xs text-slate-500">Automated candidate fit score</p>
                </div>
                <EligibilityBadge eligibility={screeningResult.eligibility} />
              </div>

              {/* Big Score Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                    Calculated Fit Score
                  </span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {Math.round(screeningResult.fit_score)}%
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Recommendation: <span className="text-indigo-600 font-bold">{screeningResult.recommended_action}</span>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-full bg-white shadow-inner border-2 border-indigo-200 flex items-center justify-center">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              {/* Score Sub-components */}
              <div className="space-y-2.5 text-xs">
                <div className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                  Scoring Breakdown (ADSA Weights)
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
                    <span className="text-slate-600">Experience (20%):</span>
                    <span className="font-bold">{screeningResult.experience_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${screeningResult.experience_score}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Education (15%):</span>
                    <span className="font-bold">{screeningResult.education_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${screeningResult.education_score}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Preferred Skills (10%):</span>
                    <span className="font-bold">{screeningResult.preferred_skills_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500" style={{ width: `${screeningResult.preferred_skills_score}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Keywords (5%):</span>
                    <span className="font-bold">{screeningResult.keyword_score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${screeningResult.keyword_score}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Missing Skills Warning */}
              {screeningResult.missing_skills && screeningResult.missing_skills.length > 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Missing Required Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {screeningResult.missing_skills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700">
                        ✕ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  All required skills successfully matched!
                </div>
              )}

              {/* Rationale */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Screening Assessment
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {screeningResult.reason}
                </p>
              </div>

              {/* Saved confirmation note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Candidate Pool
                </span>
                {screeningResult.application_id && (
                  <span className="font-mono text-[10px]">App ID #{screeningResult.application_id}</span>
                )}
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
                  Upload a PDF/TXT resume or select a sample candidate on the left to see instant AI scoring and ranking results.
                </p>
              </div>

              {/* Detected Entities Preview if parsedData exists */}
              {parsedData && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 mt-4">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Extracted Resume Metadata
                  </div>
                  <div><strong>Name:</strong> {parsedData.name}</div>
                  <div><strong>Email:</strong> {parsedData.email}</div>
                  <div><strong>Education:</strong> {parsedData.education}</div>
                  <div><strong>Experience:</strong> {parsedData.experience} years</div>
                  <div><strong>Skills Detected:</strong> {parsedData.skills}</div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
