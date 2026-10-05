export type DegreeLevel = 'Diploma' | 'Bachelors' | 'Masters' | 'PhD';

export type CandidateStatus =
  | 'Applied'
  | 'Eligible'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export type EligibilityStatus = 'Eligible' | 'Not Eligible';

export type FitCategory = 'High Match' | 'Medium Match' | 'Low Match';

export interface FitBreakdown {
  skillsMatch: number;          // Max 50 pts
  experienceMatch: number;      // Max 25 pts
  educationMatch: number;       // Max 15 pts
  descriptionSimilarity: number;// Max 10 pts
  total: number;                // 0 - 100
  category: FitCategory;
  details: {
    matchedSkills: string[];
    missingSkills: string[];
    skillMatchPercentage: number;
    expDiff: number;
    eduMatched: boolean;
    simScorePercentage: number;
  };
}

export interface Candidate {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  education: string;
  degreeLevel: DegreeLevel;
  skills: string[];
  yearsOfExperience: number;
  location: string;
  resumeText: string;
  appliedJobId: number;
  eligibilityStatus: EligibilityStatus;
  eligibilityReasons: string[];
  fitScore: number;
  fitCategory: FitCategory;
  fitBreakdown: FitBreakdown;
  status: CandidateStatus;
  applicationDate: string;
  notes?: string;
  avatarUrl?: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperience: number;
  educationRequirement: string;
  minDegreeLevel: DegreeLevel;
  jobDescription: string;
  location: string;
  status: 'Active' | 'Closed' | 'Draft';
  postedDate: string;
  salaryRange: string;
  applicantCount?: number;
}

export interface ApplicationHistoryItem {
  status: CandidateStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Application {
  id: number;
  candidateId: number;
  jobId: number;
  appliedDate: string;
  status: CandidateStatus;
  eligibilityStatus: EligibilityStatus;
  fitScore: number;
  recruiterId: number;
  statusHistory: ApplicationHistoryItem[];
}

export interface Recruiter {
  id: number;
  name: string;
  email: string;
  role: 'HR Manager' | 'Technical Recruiter' | 'Talent Acquisition Lead';
  department: string;
  avatar: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  candidateId: number;
  jobId: number;
  recruiterId: number;
  interviewerName: string;
  round: 'Technical Round 1' | 'Technical Round 2' | 'System Design' | 'HR & Behavioral' | 'Management';
  scheduledDate: string;
  scheduledTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  feedback?: string;
  rating?: number; // 1-5
}

// Academic Subjects Metadata
export type AcademicSubject = 'DBMS' | 'ADDSA' | 'DMGT' | 'OOPJ' | 'Python' | 'Java';

export interface AcademicSubjectInfo {
  code: AcademicSubject;
  title: string;
  moduleRole: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  description: string;
}

// ADDSA B-Tree Types
export interface BTreeNodeData {
  keys: number[]; // Candidate IDs
  values?: Candidate[];
  children?: BTreeNodeData[];
  isLeaf: boolean;
  id: string;
}

export interface BTreeSearchResult {
  found: boolean;
  searchedKey: number;
  steps: {
    nodeId: string;
    keys: number[];
    comparison: string;
    action: string;
  }[];
  comparisonsCount: number;
  timeComplexity: string;
  candidate?: Candidate;
}

// DBMS SQL Types
export interface SqlQueryResult {
  columns: string[];
  rows: any[];
  rowCount: number;
  executionTimeMs: number;
  query: string;
  error?: string;
}
