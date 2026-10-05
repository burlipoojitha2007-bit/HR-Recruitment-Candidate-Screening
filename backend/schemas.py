from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# ==================== JOB SCHEMAS ====================
class JobBase(BaseModel):
    title: str = Field(..., example="Python AI Developer")
    department: str = Field(..., example="AI/ML Engineering")
    description: str = Field(..., example="Looking for a Python AI developer with knowledge of machine learning...")
    required_skills: str = Field(..., example="Python, Machine Learning, SQL, FastAPI")
    preferred_skills: Optional[str] = Field("", example="Pandas, NumPy, Git, React")
    minimum_experience: float = Field(0.0, ge=0.0, example=0.0)
    education_requirement: str = Field("BTech / BE / MCA", example="BTech / BE / MCA")
    status: Optional[str] = Field("Active", example="Active")

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[str] = None
    preferred_skills: Optional[str] = None
    minimum_experience: Optional[float] = None
    education_requirement: Optional[str] = None
    status: Optional[str] = None

class JobResponse(JobBase):
    job_id: int
    created_at: datetime
    applicant_count: Optional[int] = 0
    average_fit_score: Optional[float] = 0.0

    class Config:
        from_attributes = True

# ==================== CANDIDATE SCHEMAS ====================
class CandidateBase(BaseModel):
    name: str = Field(..., example="Rahul Sharma")
    email: str = Field(..., example="rahul.sharma@example.com")
    phone: Optional[str] = Field(None, example="+91 9876543210")
    education: str = Field(..., example="BTech Computer Science")
    experience: float = Field(0.0, ge=0.0, example=1.0)
    skills: str = Field(..., example="Python, SQL, Machine Learning, Pandas, Git")
    resume_text: Optional[str] = ""

class CandidateCreate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    candidate_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ==================== APPLICATION SCHEMAS ====================
class ApplicationCreate(BaseModel):
    candidate_id: int
    job_id: int

class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., example="Shortlisted") # "Shortlisted", "Rejected", "Interview", "Screened"
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    application_id: int
    candidate_id: int
    job_id: int
    fit_score: float
    skills_score: float
    experience_score: float
    education_score: float
    preferred_skills_score: float
    keyword_score: float
    eligibility: str
    status: str
    missing_skills: Optional[str] = ""
    reason: Optional[str] = ""
    applied_at: datetime
    
    # Embedded nested data for rich UI
    candidate: Optional[CandidateResponse] = None
    job_title: Optional[str] = None
    department: Optional[str] = None

    class Config:
        from_attributes = True

# ==================== SCREENING ENGINE INTERFACES ====================
class ScreenCandidateRequest(BaseModel):
    candidate_id: Optional[int] = None
    job_id: int
    # If screening on-the-fly without saving first
    candidate_name: Optional[str] = "Candidate"
    candidate_email: Optional[str] = "candidate@example.com"
    candidate_phone: Optional[str] = ""
    candidate_skills: Optional[str] = ""
    candidate_experience: Optional[float] = 0.0
    candidate_education: Optional[str] = "BTech"
    resume_text: Optional[str] = ""
    auto_save: Optional[bool] = True

class ScreenResultResponse(BaseModel):
    fit_score: float
    skills_score: float
    experience_score: float
    education_score: float
    preferred_skills_score: float
    keyword_score: float
    eligibility: str
    missing_skills: List[str]
    reason: str
    recommended_action: str
    application_id: Optional[int] = None

# ==================== ANALYTICS SCHEMAS ====================
class AnalyticsOverview(BaseModel):
    total_jobs: int
    total_candidates: int
    total_applications: int
    eligible_count: int
    review_count: int
    not_eligible_count: int
    shortlisted_count: int
    rejected_count: int
    interview_count: int
    average_fit_score: float
    score_distribution: List[dict]
    eligibility_breakdown: List[dict]
    status_breakdown: List[dict]
    top_jobs: List[dict]
    recent_applications: List[dict]
