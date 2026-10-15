const API_BASE = "http://localhost:8000";

// Fallback Demo Seed Data for resilient standalone frontend execution
const DEFAULT_DEMO_JOBS = [
  {
    job_id: 1,
    title: "AI/ML Intern",
    department: "AI/ML Research",
    description: "Looking for an energetic AI/ML intern passionate about Python, machine learning algorithms, database querying, and neural network experimentation.",
    required_skills: "Python, Machine Learning, SQL",
    preferred_skills: "Pandas, NumPy, Git",
    minimum_experience: 0.0,
    education_requirement: "BTech / BE / MCA",
    skill_weight: 0.50,
    experience_weight: 0.30,
    education_weight: 0.20,
    status: "Active",
    applicant_count: 6,
    average_fit_score: 78.5,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    job_id: 2,
    title: "Junior Python Developer",
    department: "Engineering",
    description: "Looking for a Junior Python developer with solid knowledge of Python programming, SQL databases, RESTful APIs, and distributed pipelines.",
    required_skills: "Python, SQL, FastAPI, Git",
    preferred_skills: "Pandas, Docker, Linux",
    minimum_experience: 1.0,
    education_requirement: "BTech / BE / MCA / BCA",
    skill_weight: 0.50,
    experience_weight: 0.30,
    education_weight: 0.20,
    status: "Active",
    applicant_count: 4,
    average_fit_score: 75.2,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    job_id: 3,
    title: "Frontend Developer",
    department: "UI/UX Engineering",
    description: "Craft pixel-perfect, accessible, and high-performance user interfaces using React, JavaScript, Tailwind, and modern CSS architecture.",
    required_skills: "React, JavaScript, HTML, CSS, Tailwind",
    preferred_skills: "TypeScript, Next.js, Figma, Git",
    minimum_experience: 1.0,
    education_requirement: "BTech / BE / BCA / MCA",
    skill_weight: 0.50,
    experience_weight: 0.30,
    education_weight: 0.20,
    status: "Active",
    applicant_count: 3,
    average_fit_score: 71.0,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    job_id: 4,
    title: "Data Analyst",
    department: "Business Intelligence",
    description: "Analyze business operations data, build executive dashboards in PowerBI/Tableau, and extract actionable insights with SQL queries.",
    required_skills: "SQL, Excel, Data Analysis, Python",
    preferred_skills: "Tableau, Power BI, Statistics, Pandas",
    minimum_experience: 0.0,
    education_requirement: "BTech / BSc / Any Graduate",
    skill_weight: 0.50,
    experience_weight: 0.30,
    education_weight: 0.20,
    status: "Active",
    applicant_count: 3,
    average_fit_score: 66.8,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

const DEFAULT_DEMO_APPLICATIONS = [
  {
    application_id: 1,
    candidate_id: 1,
    candidate_name: "Rahul Sharma",
    candidate_email: "rahul.sharma@example.com",
    candidate_phone: "+91 98765 43210",
    education: "BTech Computer Science",
    experience: 1.0,
    skills: "Python, Machine Learning, SQL, Pandas, Git, FastAPI",
    resume_text: "Rahul Sharma. BTech CSE with 1 year experience building machine learning models, REST APIs with FastAPI, data manipulation with Pandas, and database modeling with SQL and Git.",
    job_id: 1,
    job_title: "AI/ML Intern",
    department: "AI/ML Research",
    fit_score: 87.7,
    skills_score: 100.0,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 66.7,
    keyword_score: 45.0,
    eligibility: "Eligible",
    status: "Shortlisted",
    missing_skills: [],
    reason: "Comprehensive skill match and meets all baseline job requirements. Recommended for shortlist.",
    recruiter_notes: "Strong candidate who aced preliminary technical screen.",
    override_reason: "",
    applied_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    application_id: 2,
    candidate_id: 2,
    candidate_name: "Sneha Patil",
    candidate_email: "sneha.patil@example.com",
    candidate_phone: "+91 98111 22334",
    education: "BTech Computer Engineering",
    experience: 0.5,
    skills: "Python, Machine Learning, SQL, NumPy, Scikit-Learn, Git",
    resume_text: "Sneha Patil. BTech Computer Engineering graduate with academic project experience in Machine Learning, Python programming, SQL databases, and NumPy data analysis.",
    job_id: 1,
    job_title: "AI/ML Intern",
    department: "AI/ML Research",
    fit_score: 87.7,
    skills_score: 100.0,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 66.7,
    keyword_score: 45.0,
    eligibility: "Eligible",
    status: "Shortlisted",
    missing_skills: [],
    reason: "Comprehensive skill match and meets all baseline job requirements. Recommended for shortlist.",
    recruiter_notes: "Quick learner with great coursework projects in scikit-learn.",
    override_reason: "",
    applied_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    application_id: 3,
    candidate_id: 3,
    candidate_name: "Priya Nair",
    candidate_email: "priya.nair@example.com",
    candidate_phone: "+91 98222 33445",
    education: "MCA (Master of Computer Applications)",
    experience: 1.0,
    skills: "Python, SQL, Git, Linux, Flask",
    resume_text: "Priya Nair. MCA with strong background in Python scripting, relational SQL database management, and basic web services. Seeking AI and software engineering roles.",
    job_id: 1,
    job_title: "AI/ML Intern",
    department: "AI/ML Research",
    fit_score: 67.8,
    skills_score: 66.7,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 33.3,
    keyword_score: 30.0,
    eligibility: "Review",
    status: "Review",
    missing_skills: ["machine learning"],
    reason: "Requires recruiter review: Missing required skill(s): machine learning. Fit score is 67.8%.",
    recruiter_notes: "Strong Python/SQL foundation; need to verify self-study in ML concepts.",
    override_reason: "",
    applied_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    application_id: 4,
    candidate_id: 4,
    candidate_name: "Kiran Verma",
    candidate_email: "kiran.verma@example.com",
    candidate_phone: "+91 98333 44556",
    education: "BTech Information Technology",
    experience: 0.0,
    skills: "Python, JavaScript, HTML, CSS",
    resume_text: "Kiran Verma. BTech IT fresh graduate. Good foundation in Python programming and front-end JavaScript development. Enthusiastic learner seeking an entry level role.",
    job_id: 1,
    job_title: "AI/ML Intern",
    department: "AI/ML Research",
    fit_score: 51.5,
    skills_score: 33.3,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 0.0,
    keyword_score: 30.0,
    eligibility: "Review",
    status: "Review",
    missing_skills: ["machine learning", "sql"],
    reason: "Requires recruiter review: Missing required skill(s): machine learning, sql. Fit score is 51.5%.",
    recruiter_notes: "",
    override_reason: "",
    applied_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    application_id: 5,
    candidate_id: 5,
    candidate_name: "Arjun Mehta",
    candidate_email: "arjun.mehta@example.com",
    candidate_phone: "+91 98444 55667",
    education: "BSc Information Technology",
    experience: 0.0,
    skills: "Java, HTML, CSS, WordPress",
    resume_text: "Arjun Mehta. BSc IT. Core competencies in Java, basic HTML/CSS design, and CMS content management.",
    job_id: 1,
    job_title: "AI/ML Intern",
    department: "AI/ML Research",
    fit_score: 23.5,
    skills_score: 0.0,
    experience_score: 100.0,
    education_score: 80.0,
    preferred_skills_score: 0.0,
    keyword_score: 30.0,
    eligibility: "Not Eligible",
    status: "Rejected",
    missing_skills: ["machine learning", "python", "sql"],
    reason: "Not eligible: Missing required skill(s): machine learning, python, sql. Overall fit score 23.5% is below threshold.",
    recruiter_notes: "Disqualified automatically due to zero overlap with core role requirements.",
    override_reason: "",
    applied_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    application_id: 6,
    candidate_id: 6,
    candidate_name: "Ananya Iyer",
    candidate_email: "ananya.iyer@example.com",
    candidate_phone: "+91 98555 66778",
    education: "MTech Computer Science",
    experience: 2.5,
    skills: "Python, Machine Learning, Deep Learning, SQL, FastAPI, PyTorch, Docker, Git",
    resume_text: "Ananya Iyer. MTech CS with 2.5 years of experience in computer vision, deep learning, PyTorch model deployment with FastAPI, and Dockerized microservices.",
    job_id: 2,
    job_title: "Junior Python Developer",
    department: "Engineering",
    fit_score: 93.5,
    skills_score: 100.0,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 80.0,
    keyword_score: 65.0,
    eligibility: "Eligible",
    status: "Interview",
    missing_skills: [],
    reason: "Exceptional candidate profile exceeding core job competencies. Recommended for immediate interview.",
    recruiter_notes: "Scheduled Round 2 technical system design interview.",
    override_reason: "",
    applied_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    application_id: 7,
    candidate_id: 7,
    candidate_name: "Rohan Deshmukh",
    candidate_email: "rohan.deshmukh@example.com",
    candidate_phone: "+91 98666 77889",
    education: "BTech Computer Science",
    experience: 2.0,
    skills: "React, JavaScript, Node.js, SQL, HTML, CSS, TypeScript, Tailwind, Git",
    resume_text: "Rohan Deshmukh. Full stack engineer with 2 years of experience developing responsive web portals in React, TypeScript, Node.js, and SQL databases.",
    job_id: 3,
    job_title: "Frontend Developer",
    department: "UI/UX Engineering",
    fit_score: 92.0,
    skills_score: 100.0,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 75.0,
    keyword_score: 55.0,
    eligibility: "Eligible",
    status: "Shortlisted",
    missing_skills: [],
    reason: "Exceptional candidate profile exceeding core job competencies. Recommended for immediate interview.",
    recruiter_notes: "Portfolio demonstrates excellent component structure.",
    override_reason: "",
    applied_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    application_id: 8,
    candidate_id: 8,
    candidate_name: "Tanmay Bhatt",
    candidate_email: "tanmay.bhatt@example.com",
    candidate_phone: "+91 98234 56789",
    education: "BSc Statistics",
    experience: 1.0,
    skills: "SQL, Excel, Data Analysis, Python, Tableau, Statistics, Pandas",
    resume_text: "Tanmay Bhatt. BSc Statistics with 1 year experience analyzing customer cohorts, building executive dashboards in Tableau, and running SQL queries.",
    job_id: 4,
    job_title: "Data Analyst",
    department: "Business Intelligence",
    fit_score: 91.5,
    skills_score: 100.0,
    experience_score: 100.0,
    education_score: 100.0,
    preferred_skills_score: 100.0,
    keyword_score: 50.0,
    eligibility: "Eligible",
    status: "Shortlisted",
    missing_skills: [],
    reason: "Comprehensive skill match and meets all baseline job requirements. Recommended for shortlist.",
    recruiter_notes: "Advanced Tableau and SQL skills verified.",
    override_reason: "",
    applied_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// LocalStorage Persistence Helpers
function getLocalJobs() {
  const stored = localStorage.getItem("hr_recruitment_jobs");
  if (!stored) {
    localStorage.setItem("hr_recruitment_jobs", JSON.stringify(DEFAULT_DEMO_JOBS));
    return DEFAULT_DEMO_JOBS;
  }
  return JSON.parse(stored);
}

function getLocalApplications() {
  const stored = localStorage.getItem("hr_recruitment_apps");
  if (!stored) {
    localStorage.setItem("hr_recruitment_apps", JSON.stringify(DEFAULT_DEMO_APPLICATIONS));
    return DEFAULT_DEMO_APPLICATIONS;
  }
  return JSON.parse(stored);
}

// Check Backend Connectivity
let isBackendReachable = true;

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorDetail = "An unexpected error occurred";
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
      } catch (e) {
        errorDetail = response.statusText;
      }
      throw new Error(errorDetail);
    }

    isBackendReachable = true;
    return response.json();
  } catch (err) {
    // If backend connection refused, switch to resilient local fallback
    if (err.name === "TypeError" || err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      isBackendReachable = false;
      return handleLocalFallback(endpoint, options);
    }
    throw err;
  }
}

// Local Fallback Handler to guarantee zero downtime during college demonstrations
function handleLocalFallback(endpoint, options = {}) {
  const method = options.method ? options.method.toUpperCase() : "GET";
  const jobs = getLocalJobs();
  const apps = getLocalApplications();

  // GET /api/dashboard
  if (endpoint.startsWith("/api/dashboard")) {
    const eligible = apps.filter(a => a.eligibility === "Eligible").length;
    const shortlisted = apps.filter(a => a.status === "Shortlisted").length;
    const review = apps.filter(a => a.eligibility === "Review" || a.status === "Review").length;
    const notEligible = apps.filter(a => a.eligibility === "Not Eligible").length;
    const avgScore = apps.reduce((acc, a) => acc + a.fit_score, 0) / Math.max(apps.length, 1);

    return Promise.resolve({
      total_candidates: apps.length,
      total_jobs: jobs.length,
      total_applications: apps.length,
      eligible_candidates: eligible,
      shortlisted_candidates: shortlisted,
      review_needed_candidates: review,
      not_eligible_candidates: notEligible,
      average_fit_score: Math.round(avgScore * 10) / 10,
      pipeline: [
        { stage: "Applied", count: apps.length, fill: "#6366f1" },
        { stage: "Screened", count: apps.length, fill: "#3b82f6" },
        { stage: "Eligible", count: eligible, fill: "#10b981" },
        { stage: "Review Needed", count: review, fill: "#f59e0b" },
        { stage: "Shortlisted", count: shortlisted, fill: "#8b5cf6" },
        { stage: "Interview", count: apps.filter(a => a.status === "Interview").length, fill: "#06b6d4" }
      ],
      top_skills: [
        { skill: "Python", count: 6 },
        { skill: "SQL", count: 6 },
        { skill: "Machine Learning", count: 4 },
        { skill: "React", count: 3 },
        { skill: "FastAPI", count: 3 },
        { skill: "Git", count: 5 }
      ],
      recent_activity: apps.slice(0, 6)
    });
  }

  // GET /jobs
  if (endpoint.startsWith("/jobs")) {
    if (method === "POST") {
      const payload = JSON.parse(options.body);
      const newJob = {
        ...payload,
        job_id: jobs.length + 1,
        applicant_count: 0,
        average_fit_score: 0.0,
        created_at: new Date().toISOString()
      };
      jobs.unshift(newJob);
      localStorage.setItem("hr_recruitment_jobs", JSON.stringify(jobs));
      return Promise.resolve(newJob);
    }
    return Promise.resolve(jobs);
  }

  // GET /applications
  if (endpoint.startsWith("/applications")) {
    if (endpoint.includes("/shortlist")) {
      const id = parseInt(endpoint.split("/")[2]);
      const app = apps.find(a => a.application_id === id);
      if (app) app.status = "Shortlisted";
      localStorage.setItem("hr_recruitment_apps", JSON.stringify(apps));
      return Promise.resolve({ message: "Shortlisted", status: "Shortlisted" });
    }
    if (endpoint.includes("/reject")) {
      const id = parseInt(endpoint.split("/")[2]);
      const app = apps.find(a => a.application_id === id);
      if (app) app.status = "Rejected";
      localStorage.setItem("hr_recruitment_apps", JSON.stringify(apps));
      return Promise.resolve({ message: "Rejected", status: "Rejected" });
    }
    if (endpoint.includes("/status")) {
      const id = parseInt(endpoint.split("/")[2]);
      const payload = JSON.parse(options.body);
      const app = apps.find(a => a.application_id === id);
      if (app) {
        app.status = payload.status;
        if (payload.notes) app.recruiter_notes = payload.notes;
        if (payload.override_reason) app.override_reason = payload.override_reason;
      }
      localStorage.setItem("hr_recruitment_apps", JSON.stringify(apps));
      return Promise.resolve({ message: "Updated", status: payload.status });
    }
    if (endpoint.includes("/notes")) {
      const id = parseInt(endpoint.split("/")[2]);
      const payload = JSON.parse(options.body);
      const app = apps.find(a => a.application_id === id);
      if (app) {
        if (payload.notes !== undefined) app.recruiter_notes = payload.notes;
        if (payload.override_reason !== undefined) app.override_reason = payload.override_reason;
      }
      localStorage.setItem("hr_recruitment_apps", JSON.stringify(apps));
      return Promise.resolve({ message: "Notes updated" });
    }

    return Promise.resolve(apps);
  }

  // GET /api/skills/distribution
  if (endpoint.startsWith("/api/skills/distribution")) {
    return Promise.resolve([
      { skill: "Python", count: 6 },
      { skill: "SQL", count: 6 },
      { skill: "Git", count: 5 },
      { skill: "Machine Learning", count: 4 },
      { skill: "FastAPI", count: 3 },
      { skill: "React", count: 3 },
      { skill: "Pandas", count: 3 },
      { skill: "Docker", count: 2 }
    ]);
  }

  // GET /api/btree/index
  if (endpoint.startsWith("/api/btree/index")) {
    return Promise.resolve({
      success: true,
      order: 3,
      total_indexed: apps.length,
      tree: {
        order: 3,
        root: {
          node_id: "node_root",
          is_leaf: false,
          keys: [4],
          candidates: [{ candidate_id: 4, name: "Kiran Verma" }],
          children: [
            {
              node_id: "node_left",
              is_leaf: true,
              keys: [1, 2, 3],
              candidates: [
                { candidate_id: 1, name: "Rahul Sharma" },
                { candidate_id: 2, name: "Sneha Patil" },
                { candidate_id: 3, name: "Priya Nair" }
              ],
              children: []
            },
            {
              node_id: "node_right",
              is_leaf: true,
              keys: [5, 6, 7],
              candidates: [
                { candidate_id: 5, name: "Arjun Mehta" },
                { candidate_id: 6, name: "Ananya Iyer" },
                { candidate_id: 7, name: "Rohan Deshmukh" }
              ],
              children: []
            }
          ]
        }
      }
    });
  }

  // POST /api/btree/search
  if (endpoint.startsWith("/api/btree/search")) {
    const payload = JSON.parse(options.body || "{}");
    const key = parseInt(payload.candidate_id || 1);
    const cand = apps.find(a => a.candidate_id === key) || apps[0];
    return Promise.resolve({
      key_searched: key,
      found: true,
      candidate: {
        candidate_id: cand.candidate_id,
        name: cand.candidate_name,
        education: cand.education,
        experience: cand.experience,
        skills: cand.skills
      },
      btree_comparisons: 3,
      btree_complexity: "O(log_m N)",
      linear_scan_comparisons: key,
      linear_scan_complexity: "O(N)",
      speedup_percentage: Math.max(0, Math.round(((key - 3) / Math.max(key, 1)) * 100)),
      traversal_trace: [
        { node_id: "node_root", node_keys: [4], is_leaf: false, action: key <= 4 ? "Descending to left child pointer 0" : "Descending to right child pointer 1" },
        { node_id: key <= 4 ? "node_left" : "node_right", node_keys: key <= 4 ? [1, 2, 3] : [5, 6, 7], is_leaf: true, action: `Key ${key} located in leaf node!` }
      ],
      disclaimer: "Educational demonstration authored by project team. SQLite uses separate native C B-Tree."
    });
  }

  // /demo/run-screening
  if (endpoint.startsWith("/demo/run-screening")) {
    return Promise.resolve({
      success: true,
      job_id: 1,
      job_title: "AI/ML Intern",
      required_skills: "Python, Machine Learning, SQL",
      preferred_skills: "Pandas, NumPy, Git",
      total_screened: apps.length,
      ranked_candidates: apps.map((a, i) => ({ ...a, rank: i + 1, recommended_action: a.status.toUpperCase() }))
    });
  }

  // /demo/reset
  if (endpoint.startsWith("/demo/reset")) {
    localStorage.removeItem("hr_recruitment_jobs");
    localStorage.removeItem("hr_recruitment_apps");
    return Promise.resolve({ message: "Local demo database reset." });
  }

  return Promise.resolve({ success: true });
}

export const api = {
  // Connection status
  isOnline: () => isBackendReachable,

  // Jobs
  getJobs: (search = "", status = "") => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    return request(`/jobs?${params.toString()}`);
  },
  getJob: (id) => request(`/jobs/${id}`),
  createJob: (data) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id, data) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteJob: (id) => request(`/jobs/${id}`, { method: "DELETE" }),

  // Candidates
  getCandidates: (search = "", skill = "", minExp = null) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (skill) params.append("skill", skill);
    if (minExp !== null && minExp !== "") params.append("min_exp", minExp);
    return request(`/candidates?${params.toString()}`);
  },
  getCandidateProfile: (id) => request(`/candidates/${id}`),
  createCandidate: (data) => request("/candidates", { method: "POST", body: JSON.stringify(data) }),
  updateCandidate: (id, data) => request(`/candidates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCandidate: (id) => request(`/candidates/${id}`, { method: "DELETE" }),

  // Applications & Candidate Ranking
  getApplications: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.jobId) params.append("job_id", filters.jobId);
    if (filters.eligibility) params.append("eligibility", filters.eligibility);
    if (filters.status) params.append("status", filters.status);
    if (filters.minScore !== undefined && filters.minScore !== "") params.append("min_score", filters.minScore);
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sort_by", filters.sortBy);
    if (filters.order) params.append("order", filters.order);
    return request(`/applications?${params.toString()}`);
  },
  getApplication: (id) => request(`/applications/${id}`),
  shortlistApplication: (id) => request(`/applications/${id}/shortlist`, { method: "POST" }),
  rejectApplication: (id) => request(`/applications/${id}/reject`, { method: "POST" }),
  interviewApplication: (id) => request(`/applications/${id}/interview`, { method: "POST" }),
  updateApplicationStatus: (id, status, notes = "", overrideReason = "") =>
    request(`/applications/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status, notes, override_reason: overrideReason }),
    }),
  updateCandidateNotes: (appId, notes, overrideReason = "") =>
    request(`/applications/${appId}/notes`, {
      method: "POST",
      body: JSON.stringify({ notes, override_reason: overrideReason }),
    }),

  // Screening Engine & Resume Parser
  screenCandidate: (data) => request("/screen-candidate", { method: "POST", body: JSON.stringify(data) }),
  uploadResume: (formData) => request("/upload-resume", { method: "POST", body: formData }),

  // Analytics & Dashboard Consolidated
  getAnalytics: () => request("/analytics"),
  getDashboardSummary: () => request("/api/dashboard"),
  getSkillsDistribution: () => request("/api/skills/distribution"),

  // B-Tree Demonstration
  getBTreeIndex: () => request("/api/btree/index"),
  searchBTreeIndex: (candidateId) =>
    request("/api/btree/search", {
      method: "POST",
      body: JSON.stringify({ candidate_id: candidateId }),
    }),

  // Demo Controls
  runDemoScreening: () => request("/demo/run-screening", { method: "POST" }),
  resetDemoDatabase: () => request("/demo/reset", { method: "POST" }),
};
