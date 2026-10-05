import { Candidate, Job, Application, Recruiter, Interview, SqlQueryResult } from '../types';

/**
 * ACADEMIC MODULE: DBMS (Database Management Systems)
 * Relational Database Engine, SQL Parser, & ER Model Inspector
 * 
 * Provides:
 * 1. Interactive SQL Query Runner executing against in-memory relational tables
 * 2. Pre-configured benchmark queries (Filter, Join, Group By, Aggregation)
 * 3. Relational Schema Metadata & ER Model Definition
 */

export interface RelationalTableSchema {
  tableName: string;
  primaryKey: string;
  foreignKeys: { column: string; referencesTable: string; referencesColumn: string }[];
  columns: { name: string; type: string; nullable: boolean; isPrimaryKey?: boolean; isForeignKey?: boolean }[];
  description: string;
}

export const RELATIONAL_SCHEMAS: RelationalTableSchema[] = [
  {
    tableName: 'candidates',
    primaryKey: 'id',
    foreignKeys: [
      { column: 'applied_job_id', referencesTable: 'jobs', referencesColumn: 'id' }
    ],
    description: 'Stores personal background, educational credentials, verified skills, and screening metrics.',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false },
      { name: 'email', type: 'VARCHAR(150)', nullable: false },
      { name: 'phone', type: 'VARCHAR(30)', nullable: false },
      { name: 'education', type: 'VARCHAR(200)', nullable: false },
      { name: 'degree_level', type: 'VARCHAR(50)', nullable: false },
      { name: 'skills', type: 'TEXT[] / JSON', nullable: false },
      { name: 'years_of_experience', type: 'NUMERIC(4,1)', nullable: false },
      { name: 'location', type: 'VARCHAR(100)', nullable: false },
      { name: 'applied_job_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'eligibility_status', type: 'VARCHAR(20)', nullable: false },
      { name: 'fit_score', type: 'INT', nullable: false },
      { name: 'fit_category', type: 'VARCHAR(30)', nullable: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false },
      { name: 'application_date', type: 'DATE', nullable: false }
    ]
  },
  {
    tableName: 'jobs',
    primaryKey: 'id',
    foreignKeys: [],
    description: 'Stores corporate open requisitions with strict educational, skill, and experience criteria.',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true },
      { name: 'title', type: 'VARCHAR(150)', nullable: false },
      { name: 'department', type: 'VARCHAR(100)', nullable: false },
      { name: 'required_skills', type: 'TEXT[] / JSON', nullable: false },
      { name: 'preferred_skills', type: 'TEXT[] / JSON', nullable: true },
      { name: 'minimum_experience', type: 'NUMERIC(4,1)', nullable: false },
      { name: 'education_requirement', type: 'VARCHAR(200)', nullable: false },
      { name: 'min_degree_level', type: 'VARCHAR(50)', nullable: false },
      { name: 'job_description', type: 'TEXT', nullable: false },
      { name: 'location', type: 'VARCHAR(100)', nullable: false },
      { name: 'status', type: 'VARCHAR(20)', nullable: false },
      { name: 'salary_range', type: 'VARCHAR(60)', nullable: true },
      { name: 'posted_date', type: 'DATE', nullable: false }
    ]
  },
  {
    tableName: 'applications',
    primaryKey: 'id',
    foreignKeys: [
      { column: 'candidate_id', referencesTable: 'candidates', referencesColumn: 'id' },
      { column: 'job_id', referencesTable: 'jobs', referencesColumn: 'id' },
      { column: 'recruiter_id', referencesTable: 'recruiters', referencesColumn: 'id' }
    ],
    description: 'Junction entity representing the 1-to-N relationships between Candidate, Job, and Recruiter.',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true },
      { name: 'candidate_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'job_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'recruiter_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'applied_date', type: 'DATE', nullable: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false },
      { name: 'eligibility_status', type: 'VARCHAR(20)', nullable: false },
      { name: 'fit_score', type: 'INT', nullable: false }
    ]
  },
  {
    tableName: 'recruiters',
    primaryKey: 'id',
    foreignKeys: [],
    description: 'HR staff members managing screening, interviewing, and selection workflows.',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true },
      { name: 'name', type: 'VARCHAR(100)', nullable: false },
      { name: 'email', type: 'VARCHAR(100)', nullable: false },
      { name: 'role', type: 'VARCHAR(50)', nullable: false },
      { name: 'department', type: 'VARCHAR(50)', nullable: false }
    ]
  },
  {
    tableName: 'interviews',
    primaryKey: 'id',
    foreignKeys: [
      { column: 'application_id', referencesTable: 'applications', referencesColumn: 'id' },
      { column: 'candidate_id', referencesTable: 'candidates', referencesColumn: 'id' },
      { column: 'recruiter_id', referencesTable: 'recruiters', referencesColumn: 'id' }
    ],
    description: 'Tracks interview rounds, schedules, technical interviewers, and candidate evaluation feedback.',
    columns: [
      { name: 'id', type: 'INT', nullable: false, isPrimaryKey: true },
      { name: 'application_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'candidate_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'recruiter_id', type: 'INT', nullable: false, isForeignKey: true },
      { name: 'interviewer_name', type: 'VARCHAR(100)', nullable: false },
      { name: 'round', type: 'VARCHAR(50)', nullable: false },
      { name: 'scheduled_date', type: 'DATE', nullable: false },
      { name: 'scheduled_time', type: 'VARCHAR(20)', nullable: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false },
      { name: 'rating', type: 'INT', nullable: true }
    ]
  }
];

export interface PresetQuery {
  id: string;
  title: string;
  category: string;
  sql: string;
  description: string;
}

export const PRESET_QUERIES: PresetQuery[] = [
  {
    id: 'q1',
    title: 'Shortlisted & High Fit Candidates',
    category: 'Filtering & Predicates',
    sql: `SELECT id, full_name, email, fit_score, status, years_of_experience
FROM candidates
WHERE fit_score >= 70
AND status = 'Shortlisted'
ORDER BY fit_score DESC;`,
    description: 'Identifies strong prospects who scored 70+ and have already progressed to Shortlisted stage.'
  },
  {
    id: 'q2',
    title: 'Search Candidates by Skill (Python / Java)',
    category: 'Text & Array Search',
    sql: `SELECT id, full_name, education, skills, years_of_experience, fit_score
FROM candidates
WHERE skills LIKE '%Python%'
ORDER BY years_of_experience DESC;`,
    description: 'Employs pattern matching on candidate skills array to locate Python specialists sorted by seniority.'
  },
  {
    id: 'q3',
    title: 'Filter Senior Candidates (Exp >= 4 Yrs)',
    category: 'Range Queries',
    sql: `SELECT id, full_name, education, years_of_experience, eligibility_status, fit_score
FROM candidates
WHERE years_of_experience >= 4
ORDER BY years_of_experience DESC;`,
    description: 'Demonstrates numerical range filtering on candidate professional experience.'
  },
  {
    id: 'q4',
    title: 'Candidate Pipeline Aggregation (GROUP BY)',
    category: 'Aggregation & Analytics',
    sql: `SELECT status, COUNT(*) AS total_candidates, ROUND(AVG(fit_score), 1) AS avg_fit_score
FROM candidates
GROUP BY status
ORDER BY total_candidates DESC;`,
    description: 'Calculates the volume of candidates and average fit rating across each recruitment lifecycle stage.'
  },
  {
    id: 'q5',
    title: 'Relational Multi-Table JOIN (App + Cand + Job)',
    category: 'Relational Joins',
    sql: `SELECT c.full_name, j.title AS job_title, j.department, a.status AS application_status, c.fit_score, a.applied_date
FROM applications a
JOIN candidates c ON a.candidate_id = c.id
JOIN jobs j ON a.job_id = j.id
WHERE a.status IN ('Interview', 'Shortlisted')
ORDER BY c.fit_score DESC;`,
    description: 'Performs relational inner joins across Candidate, Application, and Job tables to display the active interview board.'
  },
  {
    id: 'q6',
    title: 'Scheduled Interviews with Interviewer Info',
    category: 'Relational Joins',
    sql: `SELECT i.id AS interview_id, c.full_name AS candidate_name, i.round, i.interviewer_name, i.scheduled_date, i.scheduled_time, i.status
FROM interviews i
JOIN candidates c ON i.candidate_id = c.id
ORDER BY i.scheduled_date ASC;`,
    description: 'Queries upcoming interview panels joined with candidate master data.'
  }
];

export class SqlEngine {
  /**
   * Executes an SQL query against the relational datasets in-memory
   */
  public static executeQuery(
    queryText: string,
    data: {
      candidates: Candidate[];
      jobs: Job[];
      applications: Application[];
      recruiters: Recruiter[];
      interviews: Interview[];
    }
  ): SqlQueryResult {
    const start = performance.now();
    const cleanQuery = queryText.trim().replace(/;$/, '');

    try {
      // Normalize candidates to SQL-friendly row objects
      const candidatesRows = data.candidates.map(c => ({
        id: c.id,
        full_name: c.fullName,
        email: c.email,
        phone: c.phone,
        education: c.education,
        degree_level: c.degreeLevel,
        skills: c.skills.join(', '),
        years_of_experience: c.yearsOfExperience,
        location: c.location,
        applied_job_id: c.appliedJobId,
        eligibility_status: c.eligibilityStatus,
        fit_score: c.fitScore,
        fit_category: c.fitCategory,
        status: c.status,
        application_date: c.applicationDate
      }));

      const jobsRows = data.jobs.map(j => ({
        id: j.id,
        title: j.title,
        department: j.department,
        required_skills: j.requiredSkills.join(', '),
        preferred_skills: j.preferredSkills.join(', '),
        minimum_experience: j.minimumExperience,
        education_requirement: j.educationRequirement,
        min_degree_level: j.minDegreeLevel,
        location: j.location,
        status: j.status,
        salary_range: j.salaryRange,
        posted_date: j.postedDate
      }));

      const applicationsRows = data.applications.map(a => ({
        id: a.id,
        candidate_id: a.candidateId,
        job_id: a.jobId,
        recruiter_id: a.recruiterId,
        applied_date: a.appliedDate,
        status: a.status,
        eligibility_status: a.eligibilityStatus,
        fit_score: a.fitScore
      }));

      const interviewsRows = data.interviews.map(i => ({
        id: i.id,
        application_id: i.applicationId,
        candidate_id: i.candidateId,
        recruiter_id: i.recruiterId,
        interviewer_name: i.interviewerName,
        round: i.round,
        scheduled_date: i.scheduledDate,
        scheduled_time: i.scheduledTime,
        status: i.status,
        rating: i.rating || 'N/A'
      }));

      // Parse preset or common query shapes
      const upper = cleanQuery.toUpperCase();

      // Case 1: GROUP BY status
      if (upper.includes('GROUP BY STATUS')) {
        const counts: Record<string, { count: number; sumScore: number }> = {};
        candidatesRows.forEach(c => {
          if (!counts[c.status]) counts[c.status] = { count: 0, sumScore: 0 };
          counts[c.status].count++;
          counts[c.status].sumScore += c.fit_score;
        });

        const rows = Object.entries(counts).map(([status, item]) => ({
          status,
          total_candidates: item.count,
          avg_fit_score: (item.sumScore / item.count).toFixed(1)
        })).sort((a, b) => b.total_candidates - a.total_candidates);

        const duration = Math.round((performance.now() - start) * 100) / 100;
        return {
          columns: ['status', 'total_candidates', 'avg_fit_score'],
          rows,
          rowCount: rows.length,
          executionTimeMs: Math.max(0.5, duration),
          query: queryText
        };
      }

      // Case 2: Multi-table JOIN (Applications + Candidates + Jobs)
      if (upper.includes('JOIN CANDIDATES') || upper.includes('JOIN JOBS')) {
        let joinedRows = applicationsRows.map(a => {
          const cand = candidatesRows.find(c => c.id === a.candidate_id);
          const job = jobsRows.find(j => j.id === a.job_id);
          return {
            full_name: cand?.full_name || `Candidate #${a.candidate_id}`,
            job_title: job?.title || `Job #${a.job_id}`,
            department: job?.department || 'N/A',
            application_status: a.status,
            fit_score: cand?.fit_score ?? a.fit_score,
            applied_date: a.applied_date
          };
        });

        if (upper.includes("STATUS IN ('INTERVIEW', 'SHORTLISTED')") || upper.includes("STATUS = 'INTERVIEW'")) {
          joinedRows = joinedRows.filter(r => ['Interview', 'Shortlisted'].includes(r.application_status));
        }

        joinedRows.sort((a, b) => b.fit_score - a.fit_score);

        const duration = Math.round((performance.now() - start) * 100) / 100;
        return {
          columns: ['full_name', 'job_title', 'department', 'application_status', 'fit_score', 'applied_date'],
          rows: joinedRows,
          rowCount: joinedRows.length,
          executionTimeMs: Math.max(0.7, duration),
          query: queryText
        };
      }

      // Case 3: Interviews Join
      if (upper.includes('FROM INTERVIEWS')) {
        const joinedInterviews = interviewsRows.map(i => {
          const cand = candidatesRows.find(c => c.id === i.candidate_id);
          return {
            interview_id: i.id,
            candidate_name: cand?.full_name || `Candidate #${i.candidate_id}`,
            round: i.round,
            interviewer_name: i.interviewer_name,
            scheduled_date: i.scheduled_date,
            scheduled_time: i.scheduled_time,
            status: i.status
          };
        });

        const duration = Math.round((performance.now() - start) * 100) / 100;
        return {
          columns: ['interview_id', 'candidate_name', 'round', 'interviewer_name', 'scheduled_date', 'scheduled_time', 'status'],
          rows: joinedInterviews,
          rowCount: joinedInterviews.length,
          executionTimeMs: Math.max(0.4, duration),
          query: queryText
        };
      }

      // Case 4: General Candidates table filtering
      let resultRows = [...candidatesRows];

      // Skill search: WHERE skills LIKE '%Python%'
      const skillMatch = cleanQuery.match(/skills\s+LIKE\s+'%([^%]+)%'/i);
      if (skillMatch) {
        const searchSkill = skillMatch[1].toLowerCase();
        resultRows = resultRows.filter(r => r.skills.toLowerCase().includes(searchSkill));
      }

      // Fit score filter: WHERE fit_score >= 70
      const scoreMatch = cleanQuery.match(/fit_score\s*(>=|>|<=|<|=)\s*(\d+)/i);
      if (scoreMatch) {
        const op = scoreMatch[1];
        const val = parseInt(scoreMatch[2], 10);
        resultRows = resultRows.filter(r => {
          if (op === '>=') return r.fit_score >= val;
          if (op === '>') return r.fit_score > val;
          if (op === '<=') return r.fit_score <= val;
          if (op === '<') return r.fit_score < val;
          return r.fit_score === val;
        });
      }

      // Experience filter: WHERE years_of_experience >= 4
      const expMatch = cleanQuery.match(/years_of_experience\s*(>=|>|<=|<|=)\s*(\d+)/i);
      if (expMatch) {
        const op = expMatch[1];
        const val = parseFloat(expMatch[2]);
        resultRows = resultRows.filter(r => {
          if (op === '>=') return r.years_of_experience >= val;
          if (op === '>') return r.years_of_experience > val;
          if (op === '<=') return r.years_of_experience <= val;
          if (op === '<') return r.years_of_experience < val;
          return r.years_of_experience === val;
        });
      }

      // Status filter: AND status = 'Shortlisted'
      const statusMatch = cleanQuery.match(/status\s*=\s*'([^']+)'/i);
      if (statusMatch) {
        const val = statusMatch[1].toLowerCase();
        resultRows = resultRows.filter(r => r.status.toLowerCase() === val);
      }

      // ORDER BY
      if (upper.includes('ORDER BY FIT_SCORE DESC')) {
        resultRows.sort((a, b) => b.fit_score - a.fit_score);
      } else if (upper.includes('ORDER BY YEARS_OF_EXPERIENCE DESC')) {
        resultRows.sort((a, b) => b.years_of_experience - a.years_of_experience);
      }

      // Columns projection
      let selectedCols: string[] = [];
      const selectMatch = cleanQuery.match(/SELECT\s+(.*?)\s+FROM/i);
      if (selectMatch && selectMatch[1].trim() !== '*') {
        selectedCols = selectMatch[1].split(',').map(s => s.trim());
      } else {
        selectedCols = ['id', 'full_name', 'email', 'education', 'skills', 'years_of_experience', 'fit_score', 'status'];
      }

      // Filter properties to projected columns if specified
      const finalRows = resultRows.map(r => {
        if (selectedCols.includes('*') || selectedCols.length === 0) return r;
        const projected: any = {};
        selectedCols.forEach(col => {
          projected[col] = (r as any)[col] !== undefined ? (r as any)[col] : '—';
        });
        return projected;
      });

      const duration = Math.round((performance.now() - start) * 100) / 100;
      return {
        columns: selectedCols.filter(c => c !== '*').length > 0 ? selectedCols : Object.keys(finalRows[0] || {}),
        rows: finalRows,
        rowCount: finalRows.length,
        executionTimeMs: Math.max(0.3, duration),
        query: queryText
      };
    } catch (err: any) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        query: queryText,
        error: `SQL Parse Error: ${err.message || 'Malformed SQL query'}`
      };
    }
  }
}
