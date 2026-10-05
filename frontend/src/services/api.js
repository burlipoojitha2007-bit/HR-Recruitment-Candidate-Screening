const API_BASE = "http://localhost:8000";

// Helper fetch wrapper with JSON handling and clean error messages
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

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

  return response.json();
}

export const api = {
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
  updateApplicationStatus: (id, status) =>
    request(`/applications/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),

  // Screening Engine & Resume Parser
  screenCandidate: (data) => request("/screen-candidate", { method: "POST", body: JSON.stringify(data) }),
  uploadResume: (formData) => request("/upload-resume", { method: "POST", body: formData }),

  // Analytics
  getAnalytics: () => request("/analytics"),

  // Demo Controls
  runDemoScreening: () => request("/demo/run-screening", { method: "POST" }),
  resetDemoDatabase: () => request("/demo/reset", { method: "POST" }),
};
