import { Candidate, Job, Recruiter, Application, Interview } from '../types';
import { JavaEligibilityFilter } from '../services/eligibilityService';
import { PythonFitClassifier } from '../services/fitScoreService';

export const SAMPLE_JOBS: Job[] = [
  {
    id: 201,
    title: 'Senior Python & React Full Stack Engineer',
    department: 'Engineering',
    requiredSkills: ['Python', 'React', 'SQL', 'Django'],
    preferredSkills: ['TypeScript', 'Docker', 'AWS', 'REST APIs'],
    minimumExperience: 4.0,
    educationRequirement: 'B.Tech / B.E. / M.Tech in Computer Science or related degree',
    minDegreeLevel: 'Bachelors',
    jobDescription: 'Seeking an experienced Full Stack Engineer to architect modern cloud-native web portals. Must have solid command of Python backends, Django REST framework, modern React components, state management, and optimized relational SQL database queries.',
    location: 'Bangalore / Remote',
    status: 'Active',
    salaryRange: '$90,000 - $125,000 / ₹24 - ₹32 LPA',
    postedDate: '2026-09-15'
  },
  {
    id: 202,
    title: 'Principal Java Backend Architect',
    department: 'Enterprise Architecture',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'Microservices'],
    preferredSkills: ['Kafka', 'Kubernetes', 'Redis', 'System Design'],
    minimumExperience: 6.0,
    educationRequirement: 'B.Tech / M.S. in Computer Science or Information Technology',
    minDegreeLevel: 'Bachelors',
    jobDescription: 'Lead our core transaction processing engine. High-throughput distributed services built on modern Java 17+, Spring Boot microservices, multithreading, and advanced PostgreSQL/Oracle relational data structures.',
    location: 'Hyderabad / Hybrid',
    status: 'Active',
    salaryRange: '$110,000 - $145,000 / ₹30 - ₹42 LPA',
    postedDate: '2026-09-18'
  },
  {
    id: 203,
    title: 'Machine Learning & NLP Specialist',
    department: 'AI Research & Data Science',
    requiredSkills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow'],
    preferredSkills: ['PyTorch', 'HuggingFace', 'Docker', 'Data Analysis'],
    minimumExperience: 3.0,
    educationRequirement: 'M.S. or Ph.D. in Computer Science, Data Science or Mathematics',
    minDegreeLevel: 'Masters',
    jobDescription: 'Responsible for training LLM embeddings, candidate resume parsing pipelines, TF-IDF vectorizers, and semantic match algorithms. High proficiency in Python scientific stack (NumPy, Scikit-learn, PyTorch/TensorFlow).',
    location: 'Bangalore / Onsite',
    status: 'Active',
    salaryRange: '$100,000 - $135,000 / ₹28 - ₹38 LPA',
    postedDate: '2026-09-20'
  },
  {
    id: 204,
    title: 'Cloud DevOps & Platform SRE Engineer',
    department: 'Cloud Infrastructure',
    requiredSkills: ['Kubernetes', 'Docker', 'Linux', 'AWS'],
    preferredSkills: ['Terraform', 'CI/CD', 'Prometheus', 'Python'],
    minimumExperience: 3.5,
    educationRequirement: 'B.Tech or B.S. in Computer Science or IT',
    minDegreeLevel: 'Bachelors',
    jobDescription: 'Design resilient Kubernetes clusters, infrastructure as code using Terraform, GitOps CI/CD pipelines, and high-availability monitoring for multi-region cloud applications.',
    location: 'Pune / Remote',
    status: 'Active',
    salaryRange: '$85,000 - $115,000 / ₹22 - ₹30 LPA',
    postedDate: '2026-09-22'
  },
  {
    id: 205,
    title: 'Frontend UI/UX Systems Specialist',
    department: 'Product Experience',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
    preferredSkills: ['Next.js', 'Figma', 'Jest', 'Redux'],
    minimumExperience: 2.5,
    educationRequirement: 'B.Tech / B.Sc in Computer Science, Design or equivalent',
    minDegreeLevel: 'Bachelors',
    jobDescription: 'Craft beautiful, accessible, ultra-responsive dashboard interfaces. Deep mastery of modern React hooks, TypeScript type safety, Tailwind utility architecture, and smooth interactive animations.',
    location: 'Gurgaon / Hybrid',
    status: 'Active',
    salaryRange: '$75,000 - $105,000 / ₹18 - ₹26 LPA',
    postedDate: '2026-09-25'
  },
  {
    id: 206,
    title: 'Data Platform & BI Analyst',
    department: 'Business Intelligence',
    requiredSkills: ['SQL', 'Python', 'Data Analysis', 'Tableau'],
    preferredSkills: ['BigQuery', 'PowerBI', 'ETL', 'Statistics'],
    minimumExperience: 2.0,
    educationRequirement: 'Bachelors or Masters in Computer Science, Statistics, or Analytics',
    minDegreeLevel: 'Bachelors',
    jobDescription: 'Transform raw application telemetry and recruitment pipelines into executive analytics, SQL views, cohort retention charts, and automated predictive reporting dashboards.',
    location: 'Mumbai / Hybrid',
    status: 'Closed',
    salaryRange: '$65,000 - $90,000 / ₹15 - ₹22 LPA',
    postedDate: '2026-08-10'
  }
];

export const SAMPLE_RECRUITERS: Recruiter[] = [
  {
    id: 501,
    name: 'Priya Sharma',
    email: 'priya.sharma@talentcraft.io',
    role: 'HR Manager',
    department: 'Human Resources & Talent Acquisition',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 502,
    name: 'Rajesh Verma',
    email: 'rajesh.verma@talentcraft.io',
    role: 'Technical Recruiter',
    department: 'Engineering Recruitment',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 503,
    name: 'Sarah Jenkins',
    email: 'sarah.j@talentcraft.io',
    role: 'Talent Acquisition Lead',
    department: 'Executive & Cloud Staffing',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

const RAW_CANDIDATE_INPUTS: Omit<Candidate, 'eligibilityStatus' | 'eligibilityReasons' | 'fitScore' | 'fitCategory' | 'fitBreakdown'>[] = [
  {
    id: 101,
    fullName: 'Aarav Patel',
    email: 'aarav.patel@devmail.com',
    phone: '+91 98201 44521',
    education: 'B.Tech in Computer Science, IIT Bombay',
    degreeLevel: 'Bachelors',
    skills: ['Python', 'React', 'SQL', 'Django', 'TypeScript', 'Docker', 'REST APIs'],
    yearsOfExperience: 5.5,
    location: 'Bangalore, India',
    resumeText: 'Passionate Full Stack Software Engineer with 5.5 years of experience building scalable SaaS web platforms using Python, Django REST framework, and modern React with TypeScript. Proficient in relational SQL database optimization, Docker containerization, and AWS ECS deployment.',
    appliedJobId: 201,
    status: 'Shortlisted',
    applicationDate: '2026-09-26',
    notes: 'Exemplary technical screening. Strong architectural foundations and rapid system design responses.'
  },
  {
    id: 102,
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@cloudeng.org',
    phone: '+91 98452 33190',
    education: 'M.Tech in Software Engineering, BITS Pilani',
    degreeLevel: 'Masters',
    skills: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'Kafka', 'Redis', 'Kubernetes'],
    yearsOfExperience: 7.0,
    location: 'Hyderabad, India',
    resumeText: 'Senior Backend Architect with 7 years leading high-concurrency microservice ecosystems using Java 17, Spring Boot, Apache Kafka event streaming, and PostgreSQL relational clusters. Experienced in Kubernetes orchestration and distributed caching.',
    appliedJobId: 202,
    status: 'Interview',
    applicationDate: '2026-09-27',
    notes: 'Scheduled for Technical Round 2: System Design & Fault Tolerance.'
  },
  {
    id: 103,
    fullName: 'Rohan Mehta',
    email: 'rohan.mehta@nlpai.net',
    phone: '+91 97112 88412',
    education: 'M.S. in Artificial Intelligence & Data Science, Stanford Online',
    degreeLevel: 'Masters',
    skills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Data Analysis'],
    yearsOfExperience: 4.2,
    location: 'Bangalore, India',
    resumeText: 'Applied AI Researcher with 4+ years specializing in Natural Language Processing, Transformer architectures, HuggingFace embeddings, and token-based similarity search algorithms in Python, TensorFlow, and PyTorch.',
    appliedJobId: 203,
    status: 'Selected',
    applicationDate: '2026-09-22',
    notes: 'Cleared all rounds with 5/5 score. Final offer letter extended.'
  },
  {
    id: 104,
    fullName: 'Kavita Nair',
    email: 'kavita.nair@frontend.dev',
    phone: '+91 98860 12543',
    education: 'B.Tech in Information Technology, NIT Trichy',
    degreeLevel: 'Bachelors',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'Next.js', 'Redux'],
    yearsOfExperience: 3.5,
    location: 'Gurgaon, India',
    resumeText: 'Frontend Developer with 3.5 years dedicated to building pixel-perfect, accessible, and high-performance UI design systems in React, TypeScript, and Tailwind CSS. Skilled in state machines, Next.js routing, and core web vitals optimization.',
    appliedJobId: 205,
    status: 'Shortlisted',
    applicationDate: '2026-09-28',
    notes: 'Great portfolio; live demo component showcased clean code and WCAG accessibility.'
  },
  {
    id: 105,
    fullName: 'Vikramaditya Roy',
    email: 'vikram.roy@cloudops.io',
    phone: '+91 99341 67210',
    education: 'B.E. in Computer Science, Jadavpur University',
    degreeLevel: 'Bachelors',
    skills: ['Kubernetes', 'Docker', 'Linux', 'AWS', 'Terraform', 'CI/CD'],
    yearsOfExperience: 4.8,
    location: 'Pune, India',
    resumeText: 'Platform SRE with comprehensive experience designing automated Kubernetes deployments on AWS EKS. Strong command over Terraform modules, Prometheus telemetry, CI/CD pipeline automation, and multi-tenant security.',
    appliedJobId: 204,
    status: 'Interview',
    applicationDate: '2026-09-29',
    notes: 'System Design round completed successfully. Positive reviewer remarks.'
  },
  {
    id: 106,
    fullName: 'Neha Kapoor',
    email: 'neha.kapoor@techmail.com',
    phone: '+91 98199 54321',
    education: 'B.Com / Diploma in Web Development, Mumbai University',
    degreeLevel: 'Diploma',
    skills: ['Python', 'SQL', 'Flask'],
    yearsOfExperience: 1.5,
    location: 'Mumbai, India',
    resumeText: 'Junior software associate with 1.5 years experience building small internal tools using Python and basic SQL queries. Eager to transition to enterprise fullstack development.',
    appliedJobId: 201,
    status: 'Rejected',
    applicationDate: '2026-09-30',
    notes: 'Failed Java eligibility screening: Insufficient experience (1.5 vs 4.0 yrs) and missing required skills (React, Django).'
  },
  {
    id: 107,
    fullName: 'Siddharth Sen',
    email: 'siddharth.sen@javalabs.com',
    phone: '+91 98400 91823',
    education: 'B.Tech in Computer Engineering, Anna University',
    degreeLevel: 'Bachelors',
    skills: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'Docker'],
    yearsOfExperience: 6.5,
    location: 'Hyderabad, India',
    resumeText: 'Senior Backend Engineer with 6.5 years implementing Spring Boot REST APIs, relational database tuning, and microservices architecture. Strong knowledge of enterprise design patterns and messaging queues.',
    appliedJobId: 202,
    status: 'Eligible',
    applicationDate: '2026-10-01',
    notes: 'Passed automated Java rules evaluation. Pending recruiter review for shortlist.'
  },
  {
    id: 108,
    fullName: 'Divya Sundaram',
    email: 'divya.sundaram@datasci.org',
    phone: '+91 99620 44102',
    education: 'B.Tech in Information Science, RVCE Bangalore',
    degreeLevel: 'Bachelors',
    skills: ['Python', 'Data Analysis', 'SQL', 'Scikit-Learn'],
    yearsOfExperience: 2.0,
    location: 'Bangalore, India',
    resumeText: 'Data enthusiast with 2 years analyzing datasets using Python and SQL. Basic familiarity with NLP and classification models. Looking for NLP specialist openings.',
    appliedJobId: 203,
    status: 'Rejected',
    applicationDate: '2026-10-01',
    notes: 'Failed Java eligibility check: Requires Masters degree (candidate has Bachelors), missing required NLP & TensorFlow skills, experience deficit.'
  },
  {
    id: 109,
    fullName: 'Mohammed Farhan',
    email: 'farhan.m@fullstack.dev',
    phone: '+91 97411 65098',
    education: 'B.Tech in Computer Science, Jamia Millia',
    degreeLevel: 'Bachelors',
    skills: ['Python', 'React', 'SQL', 'Django', 'Docker'],
    yearsOfExperience: 4.5,
    location: 'Delhi NCR, India',
    resumeText: 'Full Stack Web Developer with 4.5 years hands-on experience in Python Django backends paired with React SPAs. Experienced in writing efficient SQL queries and managing Docker containers.',
    appliedJobId: 201,
    status: 'Eligible',
    applicationDate: '2026-10-02',
    notes: 'Eligible candidate with solid Python & Django background.'
  },
  {
    id: 110,
    fullName: 'Sneha Iyer',
    email: 'sneha.iyer@uidev.co',
    phone: '+91 98330 11994',
    education: 'B.Sc in Computer Science, St. Xaviers',
    degreeLevel: 'Bachelors',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'Figma'],
    yearsOfExperience: 3.0,
    location: 'Gurgaon, India',
    resumeText: 'Frontend Engineer with 3 years building component libraries in React with TypeScript and Tailwind CSS. Passionate about responsive layouts, design tokens, and smooth user interactions.',
    appliedJobId: 205,
    status: 'Interview',
    applicationDate: '2026-09-28',
    notes: 'Passed recruiter round. Technical pair-programming session booked.'
  },
  {
    id: 111,
    fullName: 'Aditya Chawla',
    email: 'aditya.chawla@devops.net',
    phone: '+91 99100 87654',
    education: 'B.Tech in Information Technology, DTU Delhi',
    degreeLevel: 'Bachelors',
    skills: ['Docker', 'Linux', 'AWS', 'Python'],
    yearsOfExperience: 2.0,
    location: 'Noida, India',
    resumeText: 'Cloud associate with 2 years managing EC2 instances, Dockerfiles, and bash automation scripts on AWS.',
    appliedJobId: 204,
    status: 'Rejected',
    applicationDate: '2026-10-02',
    notes: 'Not Eligible: Missing required Kubernetes skill, experience 2.0 yrs is less than minimum 3.5 yrs required.'
  },
  {
    id: 112,
    fullName: 'Tanvi Joshi',
    email: 'tanvi.joshi@aiworld.io',
    phone: '+91 98220 56789',
    education: 'M.S. in Computational Linguistics, IIIT Hyderabad',
    degreeLevel: 'Masters',
    skills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Data Analysis'],
    yearsOfExperience: 5.0,
    location: 'Bangalore, India',
    resumeText: 'NLP Scientist with 5 years enterprise experience designing question answering models, Named Entity Recognition pipelines, and semantic embeddings with Python, TensorFlow, and PyTorch.',
    appliedJobId: 203,
    status: 'Interview',
    applicationDate: '2026-09-29',
    notes: 'High fit score (95%). Interview Round 1 cleared with praise for research depth.'
  }
];

// Initialize sample candidates with genuine Java Eligibility and Python Fit Scores computed
export const SAMPLE_CANDIDATES: Candidate[] = RAW_CANDIDATE_INPUTS.map(raw => {
  const job = SAMPLE_JOBS.find(j => j.id === raw.appliedJobId) || SAMPLE_JOBS[0];
  const eligibility = JavaEligibilityFilter.evaluate(raw, job);
  const fitBreakdown = PythonFitClassifier.calculateFitScore(raw, job);

  return {
    ...raw,
    eligibilityStatus: eligibility.status,
    eligibilityReasons: eligibility.reasons,
    fitScore: fitBreakdown.total,
    fitCategory: fitBreakdown.category,
    fitBreakdown
  };
});

export const SAMPLE_APPLICATIONS: Application[] = SAMPLE_CANDIDATES.map((cand, idx) => ({
  id: 301 + idx,
  candidateId: cand.id,
  jobId: cand.appliedJobId,
  appliedDate: cand.applicationDate,
  status: cand.status,
  eligibilityStatus: cand.eligibilityStatus,
  fitScore: cand.fitScore,
  recruiterId: 501 + (idx % 3),
  statusHistory: [
    {
      status: 'Applied',
      timestamp: `${cand.applicationDate}T09:30:00Z`,
      note: 'Application and resume submitted through portal',
      updatedBy: 'Candidate Self-Service'
    },
    {
      status: cand.eligibilityStatus === 'Eligible' ? 'Eligible' : 'Rejected',
      timestamp: `${cand.applicationDate}T10:15:00Z`,
      note: cand.eligibilityStatus === 'Eligible'
        ? 'Passed Java automated eligibility rule predicates'
        : `Failed Java screening: ${(cand.eligibilityReasons || []).join('; ')}`,
      updatedBy: 'Java Rule Engine v2.4'
    },
    ...(cand.status !== 'Applied' && cand.status !== 'Eligible' && cand.status !== 'Rejected' ? [
      {
        status: cand.status,
        timestamp: `${cand.applicationDate}T16:00:00Z`,
        note: `Candidate advanced to ${cand.status} stage based on Python fit score (${cand.fitScore}%)`,
        updatedBy: SAMPLE_RECRUITERS[idx % 3].name
      }
    ] : [])
  ]
}));

export const SAMPLE_INTERVIEWS: Interview[] = [
  {
    id: 401,
    applicationId: 302,
    candidateId: 102,
    jobId: 202,
    recruiterId: 502,
    interviewerName: 'Vikram Kashyap (VP of Engineering)',
    round: 'Technical Round 2',
    scheduledDate: '2026-10-06',
    scheduledTime: '11:00 AM - 12:30 PM IST',
    status: 'Scheduled',
    rating: 4
  },
  {
    id: 402,
    applicationId: 305,
    candidateId: 105,
    jobId: 204,
    recruiterId: 503,
    interviewerName: 'Devika Ray (Lead SRE Architect)',
    round: 'System Design',
    scheduledDate: '2026-10-07',
    scheduledTime: '02:00 PM - 03:30 PM IST',
    status: 'Scheduled',
    rating: 5
  },
  {
    id: 403,
    applicationId: 310,
    candidateId: 110,
    jobId: 205,
    recruiterId: 501,
    interviewerName: 'Nitin Paul (Frontend Lead)',
    round: 'Technical Round 1',
    scheduledDate: '2026-10-08',
    scheduledTime: '04:00 PM - 05:00 PM IST',
    status: 'Scheduled',
    rating: 4
  },
  {
    id: 404,
    applicationId: 312,
    candidateId: 112,
    jobId: 203,
    recruiterId: 501,
    interviewerName: 'Dr. Sameer Joshi (Chief AI Scientist)',
    round: 'Technical Round 2',
    scheduledDate: '2026-10-09',
    scheduledTime: '10:00 AM - 11:30 AM IST',
    status: 'Scheduled',
    rating: 5
  }
];
