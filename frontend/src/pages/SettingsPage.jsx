import React, { useState } from 'react';
import { 
  Database, Cpu, Sliders, RefreshCw, BookOpen, 
  CheckCircle2, AlertTriangle, Shield, Layers, Code
} from 'lucide-react';
import { api } from '../services/api';

export function SettingsPage({ onResetDb, demoLoading }) {
  const [resetMessage, setResetMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset the database? All records will be refreshed with the 8 jobs and 16 demo candidates.")) {
      setLoading(true);
      try {
        const res = await api.resetDemoDatabase();
        setResetMessage(res.message || "Database successfully reset!");
        setTimeout(() => setResetMessage(''), 4000);
      } catch (e) {
        setResetMessage("Error resetting database.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">System Configuration & Academic Foundations</h2>
        <p className="text-xs text-slate-500">
          Engine parameters, scoring weights, database maintenance, and college curriculum syllabus mappings
        </p>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Academic Subject Mappings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wide">
              <BookOpen className="w-4 h-4" />
              Academic Concept Mappings (Viva / Demo Guide)
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This prototype directly demonstrates concepts from DBMS, SQL, DMGT, ADSA, OOP, and Python:
            </p>

            <div className="space-y-3 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  DBMS (Database Management Systems)
                </div>
                <p className="text-slate-600 mt-1">
                  Relational ER model with 3 core entities: <code>JOBS</code>, <code>CANDIDATES</code>, and <code>APPLICATIONS</code>. 
                  Enforces referential integrity with cascading foreign keys in SQLite.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  SQL (Structured Query Language)
                </div>
                <p className="text-slate-600 mt-1">
                  Utilizes <code>JOIN</code>, <code>GROUP BY</code>, <code>AVG()</code>, <code>COUNT()</code> aggregations for recruiter KPI analytics, 
                  plus parameterized multi-column filtering queries.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-violet-600" />
                  DMGT (Discrete Mathematics & Graph Theory)
                </div>
                <p className="text-slate-600 mt-1">
                  Implements Set Theory operations: Intersection (<i>Candidate ∩ Required</i>), Set Difference (<i>Required \ Candidate</i> for missing skills), 
                  and Boolean predicate decision rules for Eligibility classification.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  ADSA (Algorithms & Data Structures)
                </div>
                <p className="text-slate-600 mt-1">
                  B-tree indexed search on composite keys (<code>job_id, fit_score DESC</code>). Linear combination scoring with priority queue ranking 
                  for high-speed shortlist retrieval.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Code className="w-3.5 h-3.5 text-amber-600" />
                  OOP & Python
                </div>
                <p className="text-slate-600 mt-1">
                  Modular class hierarchy: <code>ScreeningEngine</code>, <code>ResumeParser</code>, <code>Job</code>, <code>Candidate</code>, 
                  and <code>Application</code> with encapsulated state and validation.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Engine Weights & Database Controls */}
        <div className="space-y-6">
          
          {/* Scoring Weights Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wide">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Scoring Formula Matrix
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">100% Total</span>
            </div>

            <p className="text-xs text-slate-500">
              Weights used by the Python Screening Engine to compute candidate fit scores:
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Required Skills Match</span>
                <span className="font-bold text-indigo-600">50%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Experience Alignment</span>
                <span className="font-bold text-blue-600">20%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Education Requirement</span>
                <span className="font-bold text-emerald-600">15%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Preferred / Bonus Skills</span>
                <span className="font-bold text-violet-600">10%</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Resume Keyword Relevance</span>
                <span className="font-bold text-amber-600">5%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 space-y-1">
              <div className="font-bold">Eligibility Decision Rules:</div>
              <div className="text-[11px] text-indigo-800">
                • <strong>Eligible:</strong> Fit Score ≥ 75%<br />
                • <strong>Review:</strong> Fit Score between 50% and 74%<br />
                • <strong>Not Eligible:</strong> Fit Score &lt; 50%
              </div>
            </div>
          </div>

          {/* Database & Demo Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wide">
              <Database className="w-4 h-4 text-indigo-600" />
              Database Operations
            </div>
            <p className="text-xs text-slate-500">
              Reset the local SQLite database to restore clean initial sample data for college presentations.
            </p>

            <button
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Resetting Database...' : 'Reset & Re-Seed SQLite Database'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
