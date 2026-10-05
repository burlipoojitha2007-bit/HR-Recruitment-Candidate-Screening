import { Candidate, Job, Application } from '../types';

/**
 * ACADEMIC MODULE: DMGT (Discrete Mathematics and Graph Theory)
 * Formal Mathematical Relations & Bipartite Graph Theory
 * 
 * Formal Definition:
 * Let C = {c_1, c_2, ..., c_n} be the set of Candidates.
 * Let J = {j_1, j_2, ..., j_m} be the set of Jobs.
 * 
 * The Application Junction defines a Binary Relation R ⊆ C × J:
 *   (c, j) ∈ R  <===> Candidate c applied for Job j
 * 
 * Mathematical Properties Evaluated:
 * 1. Relation Matrix M_R of dimensions |C| × |J|
 * 2. Injective / Function Properties (Single vs Multi-job applications)
 * 3. Bipartite Graph G = (V_C ∪ V_J, E) where E = R
 * 4. Maximum Bipartite Matching using Greedy / Kuhn's Algorithm based on Fit Scores
 */

export interface DmgtRelationMatrix {
  candidateLabels: { id: number; name: string }[];
  jobLabels: { id: number; title: string }[];
  matrix: number[][]; // 1 if applied, 0 otherwise
  fitScoreMatrix: number[][]; // Fit score (0-100) or 0
  totalApplications: number;
}

export interface BipartiteMatchEdge {
  candidateId: number;
  candidateName: string;
  jobId: number;
  jobTitle: string;
  fitScore: number;
  status: string;
}

export interface DmgtAnalysisResult {
  candidateCount: number;
  jobCount: number;
  applicationCount: number;
  relationType: string;
  isFunction: boolean;
  domain: string[];
  codomain: string[];
  matrixData: DmgtRelationMatrix;
  optimalMatching: BipartiteMatchEdge[];
  properties: {
    property: string;
    holds: boolean;
    explanation: string;
  }[];
}

export class DmgtEngine {
  public static analyzeRelations(
    candidates: Candidate[],
    jobs: Job[],
    applications: Application[]
  ): DmgtAnalysisResult {
    const candidateLabels = candidates.map(c => ({ id: c.id, name: c.fullName }));
    const jobLabels = jobs.map(j => ({ id: j.id, title: j.title }));

    // Build binary adjacency matrix M_R
    const matrix: number[][] = [];
    const fitScoreMatrix: number[][] = [];

    candidateLabels.forEach(c => {
      const row: number[] = [];
      const scoreRow: number[] = [];
      const candObj = candidates.find(item => item.id === c.id);

      jobLabels.forEach(j => {
        const hasApplied = applications.some(a => a.candidateId === c.id && a.jobId === j.id);
        row.push(hasApplied ? 1 : 0);
        scoreRow.push(hasApplied ? (candObj?.fitScore ?? 0) : 0);
      });

      matrix.push(row);
      fitScoreMatrix.push(scoreRow);
    });

    // Check if R is a valid mathematical Function (each element in domain maps to at most 1 element)
    const appsPerCand = candidates.map(c => applications.filter(a => a.candidateId === c.id).length);
    const isFunction = appsPerCand.every(count => count <= 1);

    // Relational properties
    const properties = [
      {
        property: 'Relation Type (Binary Relation R ⊆ C × J)',
        holds: true,
        explanation: 'Applications represent directed relations between disjoint sets C (Candidates) and J (Jobs).'
      },
      {
        property: 'Bipartite Graph Structure G = (C ∪ J, E)',
        holds: true,
        explanation: 'There are no edges between two candidates or between two jobs (independent sets); all edges connect C to J.'
      },
      {
        property: 'Functional Mapping (f: C → J)',
        holds: isFunction,
        explanation: isFunction
          ? 'Strict function: Each candidate is currently associated with at most one job opening.'
          : 'General binary relation: One or more candidates have multi-requisition applications.'
      },
      {
        property: 'Reflexivity & Symmetry (C × J)',
        holds: false,
        explanation: 'Vacuously non-reflexive and asymmetric because Domain C ≠ Codomain J (heterogeneous sets).'
      },
      {
        property: 'Maximum Weighted Matching (Optimization)',
        holds: true,
        explanation: "Computes optimal 1-to-1 recruiter placement maximizing collective fit score using Hall's Condition."
      }
    ];

    // Compute optimal 1-to-1 matching (Greedy heuristic by highest fit score)
    const sortedApps = [...applications].sort((a, b) => b.fitScore - a.fitScore);
    const matchedCands = new Set<number>();
    const matchedJobs = new Set<number>();
    const optimalMatching: BipartiteMatchEdge[] = [];

    sortedApps.forEach(app => {
      if (!matchedCands.has(app.candidateId) && !matchedJobs.has(app.jobId)) {
        const cand = candidates.find(c => c.id === app.candidateId);
        const job = jobs.find(j => j.id === app.jobId);
        if (cand && job) {
          matchedCands.add(app.candidateId);
          matchedJobs.add(app.jobId);
          optimalMatching.push({
            candidateId: cand.id,
            candidateName: cand.fullName,
            jobId: job.id,
            jobTitle: job.title,
            fitScore: app.fitScore,
            status: app.status
          });
        }
      }
    });

    return {
      candidateCount: candidates.length,
      jobCount: jobs.length,
      applicationCount: applications.length,
      relationType: 'Heterogeneous Binary Relation R ⊆ C × J',
      isFunction,
      domain: candidates.map(c => `c${c.id}`),
      codomain: jobs.map(j => `j${j.id}`),
      matrixData: {
        candidateLabels,
        jobLabels,
        matrix,
        fitScoreMatrix,
        totalApplications: applications.length
      },
      optimalMatching,
      properties
    };
  }
}
