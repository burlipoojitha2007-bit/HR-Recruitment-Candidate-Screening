import { Candidate, Job, Application, Recruiter, Interview, CandidateStatus } from '../types';
import { SAMPLE_CANDIDATES, SAMPLE_JOBS, SAMPLE_APPLICATIONS, SAMPLE_RECRUITERS, SAMPLE_INTERVIEWS } from '../data/sampleData';
import { JavaEligibilityFilter } from './eligibilityService';
import { PythonFitClassifier } from './fitScoreService';
import { AtsWorkflowEngine } from './atsService';

const STORAGE_KEYS = {
  CANDIDATES: 'hr_screening_candidates_v1',
  JOBS: 'hr_screening_jobs_v1',
  APPLICATIONS: 'hr_screening_applications_v1',
  RECRUITERS: 'hr_screening_recruiters_v1',
  INTERVIEWS: 'hr_screening_interviews_v1',
  ACTIVE_USER: 'hr_screening_active_user_v1'
};

export class StorageService {
  /**
   * Helper to safely read from localStorage
   */
  private static read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  /**
   * Helper to safely write to localStorage
   */
  private static write<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to write to localStorage for key ${key}:`, e);
    }
  }

  // --- CANDIDATES ---
  public static getCandidates(): Candidate[] {
    const data = this.read<Candidate[]>(STORAGE_KEYS.CANDIDATES, []);
    if (!data || data.length === 0) {
      this.write(STORAGE_KEYS.CANDIDATES, SAMPLE_CANDIDATES);
      return SAMPLE_CANDIDATES;
    }
    return data;
  }

  public static saveCandidates(candidates: Candidate[]): void {
    this.write(STORAGE_KEYS.CANDIDATES, candidates);
  }

  public static addCandidate(rawInput: Omit<Candidate, 'id' | 'eligibilityStatus' | 'eligibilityReasons' | 'fitScore' | 'fitCategory' | 'fitBreakdown' | 'status'> & { status?: CandidateStatus }): Candidate {
    const candidates = this.getCandidates();
    const jobs = this.getJobs();
    const nextId = candidates.length > 0 ? Math.max(...candidates.map(c => c.id)) + 1 : 101;

    const job = jobs.find(j => j.id === rawInput.appliedJobId) || jobs[0];
    const eligibility = JavaEligibilityFilter.evaluate(rawInput, job);
    const fitBreakdown = PythonFitClassifier.calculateFitScore(rawInput, job);

    const initialStatus: CandidateStatus = rawInput.status || (eligibility.isEligible ? 'Eligible' : 'Applied');

    const newCandidate: Candidate = {
      ...rawInput,
      id: nextId,
      eligibilityStatus: eligibility.status,
      eligibilityReasons: eligibility.reasons,
      fitScore: fitBreakdown.total,
      fitCategory: fitBreakdown.category,
      fitBreakdown,
      status: initialStatus
    };

    candidates.unshift(newCandidate);
    this.saveCandidates(candidates);

    // Also add an Application entry
    const applications = this.getApplications();
    const nextAppId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 301;
    const newApp: Application = {
      id: nextAppId,
      candidateId: newCandidate.id,
      jobId: job.id,
      appliedDate: newCandidate.applicationDate,
      status: initialStatus,
      eligibilityStatus: eligibility.status,
      fitScore: fitBreakdown.total,
      recruiterId: 501,
      statusHistory: [
        {
          status: 'Applied',
          timestamp: new Date().toISOString(),
          note: 'Resume uploaded via Candidate Management portal',
          updatedBy: 'System Intake'
        },
        {
          status: eligibility.isEligible ? 'Eligible' : 'Rejected',
          timestamp: new Date().toISOString(),
          note: eligibility.isEligible
            ? 'Java eligibility screening passed'
            : `Java screening rejected: ${(eligibility.reasons || []).join('; ')}`,
          updatedBy: 'Java Rule Engine'
        }
      ]
    };
    applications.unshift(newApp);
    this.saveApplications(applications);

    return newCandidate;
  }

  public static updateCandidate(candidate: Candidate): Candidate {
    const candidates = this.getCandidates();
    const jobs = this.getJobs();
    const job = jobs.find(j => j.id === candidate.appliedJobId) || jobs[0];

    // Re-evaluate Java eligibility and Python fit score
    const eligibility = JavaEligibilityFilter.evaluate(candidate, job);
    const fitBreakdown = PythonFitClassifier.calculateFitScore(candidate, job);

    const updated: Candidate = {
      ...candidate,
      eligibilityStatus: eligibility.status,
      eligibilityReasons: eligibility.reasons,
      fitScore: fitBreakdown.total,
      fitCategory: fitBreakdown.category,
      fitBreakdown
    };

    const index = candidates.findIndex(c => c.id === candidate.id);
    if (index !== -1) {
      candidates[index] = updated;
      this.saveCandidates(candidates);
    }

    // Synchronize Application table
    const apps = this.getApplications();
    const appIndex = apps.findIndex(a => a.candidateId === candidate.id && a.jobId === candidate.appliedJobId);
    if (appIndex !== -1) {
      apps[appIndex].status = updated.status;
      apps[appIndex].fitScore = updated.fitScore;
      apps[appIndex].eligibilityStatus = updated.eligibilityStatus;
      this.saveApplications(apps);
    }

    return updated;
  }

  public static deleteCandidate(id: number): void {
    const candidates = this.getCandidates().filter(c => c.id !== id);
    this.saveCandidates(candidates);

    const apps = this.getApplications().filter(a => a.candidateId !== id);
    this.saveApplications(apps);

    const interviews = this.getInterviews().filter(i => i.candidateId !== id);
    this.saveInterviews(interviews);
  }

  // --- JOBS ---
  public static getJobs(): Job[] {
    const data = this.read<Job[]>(STORAGE_KEYS.JOBS, []);
    if (!data || data.length === 0) {
      this.write(STORAGE_KEYS.JOBS, SAMPLE_JOBS);
      return SAMPLE_JOBS;
    }
    return data;
  }

  public static saveJobs(jobs: Job[]): void {
    this.write(STORAGE_KEYS.JOBS, jobs);
  }

  public static addJob(jobInput: Omit<Job, 'id'>): Job {
    const jobs = this.getJobs();
    const nextId = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 201;
    const newJob: Job = { ...jobInput, id: nextId };
    jobs.unshift(newJob);
    this.saveJobs(jobs);
    return newJob;
  }

  public static updateJob(job: Job): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index !== -1) {
      jobs[index] = job;
      this.saveJobs(jobs);

      // Recalculate candidates linked to this job
      const candidates = this.getCandidates();
      let changed = false;
      const updatedCandidates = candidates.map(c => {
        if (c.appliedJobId === job.id) {
          changed = true;
          const eligibility = JavaEligibilityFilter.evaluate(c, job);
          const fitBreakdown = PythonFitClassifier.calculateFitScore(c, job);
          return {
            ...c,
            eligibilityStatus: eligibility.status,
            eligibilityReasons: eligibility.reasons,
            fitScore: fitBreakdown.total,
            fitCategory: fitBreakdown.category,
            fitBreakdown
          };
        }
        return c;
      });
      if (changed) {
        this.saveCandidates(updatedCandidates);
      }
    }
  }

  public static deleteJob(id: number): void {
    const jobs = this.getJobs().filter(j => j.id !== id);
    this.saveJobs(jobs);
  }

  // --- APPLICATIONS ---
  public static getApplications(): Application[] {
    const data = this.read<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
    if (!data || data.length === 0) {
      this.write(STORAGE_KEYS.APPLICATIONS, SAMPLE_APPLICATIONS);
      return SAMPLE_APPLICATIONS;
    }
    return data;
  }

  public static saveApplications(applications: Application[]): void {
    this.write(STORAGE_KEYS.APPLICATIONS, applications);
  }

  public static updateApplicationStatus(
    candidateId: number,
    newStatus: CandidateStatus,
    recruiterName: string,
    note?: string
  ): { success: boolean; message: string } {
    const candidates = this.getCandidates();
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return { success: false, message: 'Candidate not found' };

    const transition = AtsWorkflowEngine.transitionStatus(candidate, newStatus, recruiterName, note);
    if (!transition.success) {
      return { success: false, message: transition.message };
    }

    // Update candidate
    candidate.status = newStatus;
    this.saveCandidates(candidates);

    // Update application
    const applications = this.getApplications();
    const app = applications.find(a => a.candidateId === candidateId);
    if (app) {
      app.status = newStatus;
      app.statusHistory.push(transition.historyItem);
      this.saveApplications(applications);
    }

    return { success: true, message: transition.message };
  }

  // --- RECRUITERS ---
  public static getRecruiters(): Recruiter[] {
    const data = this.read<Recruiter[]>(STORAGE_KEYS.RECRUITERS, []);
    if (!data || data.length === 0) {
      this.write(STORAGE_KEYS.RECRUITERS, SAMPLE_RECRUITERS);
      return SAMPLE_RECRUITERS;
    }
    return data;
  }

  // --- INTERVIEWS ---
  public static getInterviews(): Interview[] {
    const data = this.read<Interview[]>(STORAGE_KEYS.INTERVIEWS, []);
    if (!data || data.length === 0) {
      this.write(STORAGE_KEYS.INTERVIEWS, SAMPLE_INTERVIEWS);
      return SAMPLE_INTERVIEWS;
    }
    return data;
  }

  public static saveInterviews(interviews: Interview[]): void {
    this.write(STORAGE_KEYS.INTERVIEWS, interviews);
  }

  public static scheduleInterview(input: Omit<Interview, 'id'>): Interview {
    const interviews = this.getInterviews();
    const nextId = interviews.length > 0 ? Math.max(...interviews.map(i => i.id)) + 1 : 401;
    const newInterview: Interview = { ...input, id: nextId };
    interviews.unshift(newInterview);
    this.saveInterviews(interviews);

    // Ensure candidate status is updated to Interview
    this.updateApplicationStatus(input.candidateId, 'Interview', 'Interview Coordinator', `Scheduled ${input.round} on ${input.scheduledDate} at ${input.scheduledTime}`);

    return newInterview;
  }

  // --- RESET & EXPORT ---
  public static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.CANDIDATES);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.RECRUITERS);
    localStorage.removeItem(STORAGE_KEYS.INTERVIEWS);
    this.getCandidates();
    this.getJobs();
    this.getApplications();
    this.getRecruiters();
    this.getInterviews();
  }

  public static exportAllJson(): string {
    const payload = {
      candidates: this.getCandidates(),
      jobs: this.getJobs(),
      applications: this.getApplications(),
      recruiters: this.getRecruiters(),
      interviews: this.getInterviews(),
      exportTimestamp: new Date().toISOString()
    };
    return JSON.stringify(payload, null, 2);
  }

  public static importAllJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.candidates)) this.saveCandidates(data.candidates);
      if (Array.isArray(data.jobs)) this.saveJobs(data.jobs);
      if (Array.isArray(data.applications)) this.saveApplications(data.applications);
      if (Array.isArray(data.interviews)) this.saveInterviews(data.interviews);
      return true;
    } catch {
      return false;
    }
  }
}
