import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { ScreeningPage } from './pages/ScreeningPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TechnicalInsightsPage } from './pages/TechnicalInsightsPage';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import { AddCandidateModal } from './components/AddCandidateModal';
import { ScoreBadge, EligibilityBadge } from './components/ScoreBadge';
import { api } from './services/api';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState('dashboard');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [preselectedJobId, setPreselectedJobId] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  
  // Demo Execution state
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResults, setDemoResults] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  React.useEffect(() => {
    api.getJobs().then(setJobsList).catch(() => {});
  }, []);

  // Global Demo Screening Trigger
  const handleRunDemo = async () => {
    setDemoLoading(true);
    try {
      const results = await api.runDemoScreening();
      setDemoResults(results);
      setShowDemoModal(true);
    } catch (err) {
      console.error(err);
      alert('Failed to execute demo screening: ' + err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (window.confirm("Reset database to initial 8 jobs and 16 candidates?")) {
      try {
        await api.resetDemoDatabase();
        window.location.reload();
      } catch (e) {
        alert("Failed to reset database: " + e.message);
      }
    }
  };

  const handleCandidateStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, newStatus);
      if (selectedCandidate) {
        setSelectedCandidate(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        onRunDemo={handleRunDemo}
        onResetDb={handleResetDb}
        demoLoading={demoLoading}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onRunDemo={handleRunDemo}
          demoLoading={demoLoading}
          globalSearch={globalSearch}
          setGlobalSearch={(val) => {
            setGlobalSearch(val);
            if (val && currentTab !== 'candidates') {
              setTab('candidates');
            }
          }}
        />

        {/* View Switcher */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {currentTab === 'dashboard' && (
            <DashboardPage
              setTab={setTab}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              onRunDemo={handleRunDemo}
              demoLoading={demoLoading}
              onOpenAddCandidate={() => setIsAddCandidateOpen(true)}
            />
          )}

          {currentTab === 'jobs' && (
            <JobsPage
              onSelectJobForCandidates={(jobId) => {
                setPreselectedJobId(jobId);
                setTab('candidates');
              }}
              onSelectJobForScreening={(jobId) => {
                setPreselectedJobId(jobId);
                setTab('screening');
              }}
            />
          )}

          {currentTab === 'candidates' && (
            <CandidatesPage
              initialJobId={preselectedJobId}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              onNavigateToScreening={() => setTab('screening')}
            />
          )}

          {currentTab === 'screening' && (
            <ScreeningPage
              preselectedJobId={preselectedJobId}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
            />
          )}

          {currentTab === 'technical' && (
            <TechnicalInsightsPage
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsPage />}

          {currentTab === 'settings' && (
            <SettingsPage
              onResetDb={handleResetDb}
              demoLoading={demoLoading}
            />
          )}
        </main>
      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddCandidateOpen}
        onClose={() => setIsAddCandidateOpen(false)}
        onCandidateAdded={() => {
          setIsAddCandidateOpen(false);
          setTab('candidates');
        }}
        jobs={jobsList}
      />

      {/* Candidate Profile Detailed Modal */}
      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleCandidateStatusChange}
        />
      )}

      {/* Interactive Demo Results Modal */}
      {showDemoModal && demoResults && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in my-8">
            
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Demo Screening Pipeline Completed
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Candidate Ranking Output: {demoResults.job_title}
                  </h3>
                  <p className="text-xs text-indigo-200 mt-1">
                    Evaluated candidates using 50% Skills, 20% Exp, 15% Edu, 10% Preferred, 5% Keywords.
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(75vh-100px)] overflow-y-auto space-y-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Automated Candidate Rankings ({demoResults.total_screened} Total Evaluated)
              </div>

              <div className="space-y-3">
                {demoResults.ranked_candidates.slice(0, 5).map((cand) => (
                  <div
                    key={cand.candidate_id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        cand.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        cand.rank === 2 ? 'bg-slate-200 text-slate-800' :
                        cand.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        #{cand.rank}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{cand.candidate_name}</div>
                        <div className="text-xs text-slate-500">{cand.education} • {cand.experience} yrs exp</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          <strong>Skills:</strong> {cand.skills}
                        </div>
                        {cand.missing_skills.length > 0 && (
                          <div className="text-[11px] text-rose-600 font-medium mt-0.5">
                            Missing: {cand.missing_skills.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0">
                      <ScoreBadge score={cand.fit_score} />
                      <EligibilityBadge eligibility={cand.eligibility} />
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        cand.recommended_action === 'SHORTLIST' ? 'bg-emerald-100 text-emerald-800' :
                        cand.recommended_action === 'REVIEW' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {cand.recommended_action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Data saved and updated in SQLite database.
              </span>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  setTab('candidates');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                Go to Candidate Pool Table
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
