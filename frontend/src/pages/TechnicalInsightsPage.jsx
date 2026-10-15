import React, { useState, useEffect } from 'react';
import { 
  Database, Cpu, Code2, Network, Sliders, ArrowRight, CheckCircle2, 
  Search, ShieldAlert, Sparkles, BookOpen, Layers, Terminal, ChevronRight, Play
} from 'lucide-react';
import { api } from '../services/api';

export function TechnicalInsightsPage() {
  const [btreeSearchKey, setBtreeSearchKey] = useState(5);
  const [btreeResult, setBtreeResult] = useState(null);
  const [btreeLoading, setBtreeLoading] = useState(false);
  const [treeStructure, setTreeStructure] = useState(null);

  // Live SQL Playground state
  const [sqlJobFilter, setSqlJobFilter] = useState('1');
  const [sqlMinScore, setSqlMinScore] = useState('70');
  const [sqlResults, setSqlResults] = useState([]);
  const [sqlLoading, setSqlLoading] = useState(false);
  const [sqlMetrics, setSqlMetrics] = useState({ rows: 0, executionTimeMs: 4 });

  useEffect(() => {
    // Load initial B-Tree structure and run default search
    const initBTree = async () => {
      try {
        const treeData = await api.getBTreeIndex();
        if (treeData && treeData.tree) {
          setTreeStructure(treeData.tree);
        }
        handleRunBTreeSearch(5);
      } catch (e) {
        console.error("B-tree loading error:", e);
      }
    };
    initBTree();
    handleRunSqlQuery();
  }, []);

  const handleRunBTreeSearch = async (keyToSearch) => {
    const key = parseInt(keyToSearch || btreeSearchKey);
    setBtreeLoading(true);
    try {
      const res = await api.searchBTreeIndex(key);
      setBtreeResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setBtreeLoading(false);
    }
  };

  const handleRunSqlQuery = async () => {
    setSqlLoading(true);
    const start = performance.now();
    try {
      const apps = await api.getApplications({
        jobId: sqlJobFilter,
        minScore: sqlMinScore,
        eligibility: 'Eligible',
        sortBy: 'fit_score',
        order: 'desc'
      });
      const end = performance.now();
      setSqlResults(apps);
      setSqlMetrics({
        rows: apps.length,
        executionTimeMs: Math.max(1, Math.round(end - start))
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSqlLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Academic Project Demonstration & Viva Guide
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Technical Insights & CS Engineering Foundations
            </h2>
            <p className="text-xs text-indigo-200 mt-1 max-w-3xl leading-relaxed">
              Comprehensive explanation of DBMS relational schemas, SQL indexing, B-Tree data structures,
              deterministic screening rules, and Object-Oriented design patterns implemented in this project.
            </p>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-right shrink-0">
            <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold block">Curriculum Alignment</span>
            <span className="text-sm font-bold text-white">DBMS • ADSA • OOP • Python</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: ARCHITECTURE DIAGRAM */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
            <Network className="w-4 h-4" />
            1. End-to-End System Architecture
          </div>
          <span className="text-xs text-slate-400">Client-Server Pattern</span>
        </div>

        <p className="text-xs text-slate-600">
          The system uses a clean three-tier architecture: React Single-Page Application (Frontend),
          FastAPI Python REST Service (Backend Logic & Scoring), and SQLite Relational Database (Persistent Storage).
        </p>

        {/* Visual Architecture Flow Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Block 1: Frontend */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-blue-50/60 to-indigo-50/30 border border-blue-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-blue-900 uppercase">Tier 1: Presentation (SPA)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800">React + Vite</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>React 18 Component Hierarchy</li>
              <li>Recharts interactive telemetry</li>
              <li>Tailwind CSS Design System</li>
              <li>Asynchronous REST API Client</li>
            </ul>
          </div>

          {/* Block 2: Backend */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-50/60 to-violet-50/30 border border-indigo-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-900 uppercase">Tier 2: Business Logic</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800">FastAPI (Python)</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Deterministic Screening Engine</li>
              <li>Configurable Weight Normalizer</li>
              <li>B-Tree Candidate Indexing Service</li>
              <li>Pydantic Input Validation & CORS</li>
            </ul>
          </div>

          {/* Block 3: Database */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-emerald-50/60 to-teal-50/30 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-900 uppercase">Tier 3: Persistence</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800">SQLite + SQLAlchemy</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>Relational ER Schema (Foreign Keys)</li>
              <li>Parameterized SQL Aggregations</li>
              <li>Composite Indexes on <code>(job_id, fit_score)</code></li>
              <li>ACID transaction compliance</li>
            </ul>
          </div>

        </div>
      </div>

      {/* SECTION 2: B-TREE INDEXING DEMONSTRATION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
              <Cpu className="w-4 h-4" />
              2. B-Tree Candidate Indexing & Search Engine (ADSA)
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrates multi-way balanced indexing tree mechanics and logarithmic search speedup
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
            Order m = 3 (Max Keys = 2)
          </span>
        </div>

        {/* Academic Disclaimer Callout */}
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Honest Academic Note for Evaluation:</strong> This candidate B-Tree index simulator was authored
            in Python and JavaScript by our student project team to demonstrate multi-way balanced indexing tree mechanics,
            node splitting, and logarithmic search complexity ($O(\log_m N)$) versus sequential scans ($O(N)$). SQLite internally
            implements its own separate, highly-optimized C-level B-Tree storage engine for tables and indices.
          </div>
        </div>

        {/* Interactive Search Controls */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Search Candidate by Key (ID 1 - 16):</span>
            <input
              type="number"
              min="1"
              max="25"
              value={btreeSearchKey}
              onChange={(e) => setBtreeSearchKey(e.target.value)}
              className="w-20 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-center focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => handleRunBTreeSearch(btreeSearchKey)}
            disabled={btreeLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {btreeLoading ? 'Searching Tree...' : 'Run B-Tree Indexed Search'}
          </button>
        </div>

        {/* Search Results & Complexity Comparison */}
        {btreeResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {/* Metric 1 */}
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">B-Tree Comparisons</span>
              <div className="text-2xl font-black text-indigo-900">{btreeResult.btree_comparisons} Steps</div>
              <div className="text-[11px] text-indigo-600 font-semibold font-mono">Complexity: O(log_m N)</div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Unindexed Sequential Scan</span>
              <div className="text-2xl font-black text-slate-800">{btreeResult.linear_scan_comparisons} Steps</div>
              <div className="text-[11px] text-slate-500 font-semibold font-mono">Complexity: O(N) Table Scan</div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Search Efficiency Speedup</span>
              <div className="text-2xl font-black text-emerald-800">
                {btreeResult.linear_scan_comparisons > btreeResult.btree_comparisons
                  ? `${Math.round(((btreeResult.linear_scan_comparisons - btreeResult.btree_comparisons) / btreeResult.linear_scan_comparisons) * 100)}% Faster`
                  : 'Fast Path Found'}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">Logarithmic branching advantage</div>
            </div>
          </div>
        )}

        {/* Step-by-Step Traversal Trace */}
        {btreeResult && btreeResult.traversal_trace && (
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 space-y-2 font-mono text-xs">
            <div className="text-amber-400 font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Index Traversal Path Trace (Key = {btreeResult.key_searched}):
            </div>
            <div className="space-y-1 pl-2 border-l border-slate-700">
              {btreeResult.traversal_trace.map((step, idx) => (
                <div key={idx} className="text-[11px] leading-relaxed">
                  <span className="text-indigo-400">Step {idx + 1}:</span> Node [{step.node_keys.join(', ')}] {step.is_leaf ? '(Leaf)' : '(Internal)'} ➔ <span className="text-emerald-300">{step.action}</span>
                </div>
              ))}
            </div>
            {btreeResult.found && btreeResult.candidate && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-indigo-300 text-xs">
                Candidate Record Located: <strong>{btreeResult.candidate.name}</strong> ({btreeResult.candidate.education}, {btreeResult.candidate.experience} yrs exp)
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: DBMS RELATIONAL MODEL & LIVE SQL PLAYGROUND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: DBMS ER Schema */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
            <Database className="w-4 h-4" />
            3. DBMS Relational Schema (ER Model)
          </div>
          <p className="text-xs text-slate-600">
            Normalized 3NF relational schema enforcing referential integrity with cascading deletes:
          </p>

          <div className="space-y-3 text-xs">
            {/* Table 1: JOBS */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>TABLE: jobs</span>
                <span className="text-[10px] text-indigo-600 font-mono">Entity</span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">
                PK: job_id (INT) | title, department, required_skills, preferred_skills, min_experience, education_req, skill_weight, exp_weight, edu_weight, status
              </p>
            </div>

            {/* Table 2: CANDIDATES */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>TABLE: candidates</span>
                <span className="text-[10px] text-indigo-600 font-mono">Entity</span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">
                PK: candidate_id (INT) | name, email (UNIQUE), phone, education, experience, skills, resume_text, created_at
              </p>
            </div>

            {/* Table 3: APPLICATIONS */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>TABLE: applications (Associative Relationship)</span>
                <span className="text-[10px] text-indigo-600 font-mono">Relationship 1:N</span>
              </div>
              <p className="text-[11px] text-slate-600 font-mono">
                PK: application_id | FK: candidate_id ➔ candidates, FK: job_id ➔ jobs | fit_score, skills_score, exp_score, edu_score, eligibility, status, recruiter_notes, override_reason
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live SQL Filtering Playground */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
              <Terminal className="w-4 h-4" />
              4. Live SQL Query Execution Engine
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">
              {sqlMetrics.rows} rows in {sqlMetrics.executionTimeMs}ms
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Interactive SQL filtering demonstration. Adjust query parameters and execute the query against SQLite:
          </p>

          {/* Query Code Display */}
          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-1 overflow-x-auto">
            <div className="text-emerald-400">SELECT c.candidate_id, c.name, c.experience, a.fit_score, a.eligibility</div>
            <div>FROM candidates c</div>
            <div>JOIN applications a ON c.candidate_id = a.candidate_id</div>
            <div className="text-amber-300">WHERE a.job_id = {sqlJobFilter} AND a.eligibility = 'Eligible' AND a.fit_score &gt;= {sqlMinScore}</div>
            <div className="text-indigo-400">ORDER BY a.fit_score DESC;</div>
          </div>

          {/* Query Filters */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Job ID</label>
              <select
                value={sqlJobFilter}
                onChange={(e) => setSqlJobFilter(e.target.value)}
                className="w-full p-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="1">Job #1 (AI/ML Intern)</option>
                <option value="2">Job #2 (Junior Python Dev)</option>
                <option value="3">Job #3 (Frontend Dev)</option>
                <option value="4">Job #4 (Data Analyst)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Min Fit Score: {sqlMinScore}%</label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={sqlMinScore}
                onChange={(e) => setSqlMinScore(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={handleRunSqlQuery}
            disabled={sqlLoading}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs"
          >
            <Play className="w-3.5 h-3.5" />
            {sqlLoading ? 'Executing Query...' : 'Execute SQL Query on SQLite'}
          </button>

          {/* Results table snippet */}
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase sticky top-0">
                <tr>
                  <th className="p-2">Rank</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Exp</th>
                  <th className="p-2 text-right">Fit Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sqlResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-700">#{i + 1}</td>
                    <td className="p-2 font-medium text-slate-900">{r.candidate_name}</td>
                    <td className="p-2 text-slate-500">{r.experience}y</td>
                    <td className="p-2 text-right font-bold text-indigo-600">{r.fit_score}%</td>
                  </tr>
                ))}
                {sqlResults.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400 text-xs">
                      No eligible candidates match this filter threshold.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* SECTION 4: SCORING ENGINE FORMULAS & OOP CONCEPTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Scoring Engine Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
            <Sliders className="w-4 h-4" />
            5. Deterministic Screening & Scoring Formula
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Candidates are screened through a transparent multi-step evaluation pipeline:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800">Step 1: Set-Theoretic Skill Overlap</div>
              <p className="text-slate-600 mt-1 font-mono text-[11px]">
                Matched = Candidate_Skills ∩ Required_Skills<br />
                Missing = Required_Skills \ Candidate_Skills<br />
                Skills Score = (|Matched| / |Required|) * 100
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800">Step 2: Linear Combination Fit Score</div>
              <p className="text-slate-600 mt-1 font-mono text-[11px]">
                Fit Score = (W_skill * Skills_Score) + (W_exp * Exp_Score) + (W_edu * Edu_Score)<br />
                Default Weights: W_skill=0.50, W_exp=0.30, W_edu=0.20 (Normalized)
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800">Step 3: Boolean Decision Rules</div>
              <p className="text-slate-600 mt-1 text-[11px]">
                • <strong>Eligible:</strong> Fit Score ≥ 75% AND Skills Score ≥ 60%<br />
                • <strong>Review Needed:</strong> 50% ≤ Fit Score &lt; 75% OR missing critical mandatory skill<br />
                • <strong>Not Eligible:</strong> Fit Score &lt; 50%
              </p>
            </div>
          </div>
        </div>

        {/* OOP Concepts Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm uppercase tracking-wide">
            <Code2 className="w-4 h-4" />
            6. Object-Oriented Programming (OOP) Principles
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Software engineering design patterns and OOP concepts used in the Python backend:
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">Encapsulation</div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                The <code>ScreeningEngine</code> class encapsulates private scoring rules, skill normalization aliases,
                and internal threshold evaluations into a coherent reusable unit.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">Abstraction</div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                The database ORM models (<code>Job</code>, <code>Candidate</code>, <code>Application</code>) abstract raw SQL queries,
                allowing clean object manipulation without hardcoded table DDL statements.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-indigo-900">Separation of Concerns & Modularity</div>
              <p className="text-slate-600 mt-0.5 text-[11px]">
                Distinct modular routers (<code>routes/jobs.py</code>, <code>routes/candidates.py</code>, <code>routes/applications.py</code>)
                isolate endpoint definitions, while services isolate algorithm math.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
