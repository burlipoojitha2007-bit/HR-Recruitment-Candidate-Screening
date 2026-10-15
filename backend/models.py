import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from database import Base

class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    required_skills = Column(Text, nullable=False)      # Comma-separated or JSON list
    preferred_skills = Column(Text, default="")         # Comma-separated or JSON list
    minimum_experience = Column(Float, default=0.0)     # In years
    education_requirement = Column(String(150), default="BTech / BE / MCA / Any Graduate")
    skill_weight = Column(Float, default=0.50)          # 50% Skill Match default
    experience_weight = Column(Float, default=0.30)     # 30% Experience Match default
    education_weight = Column(Float, default=0.20)      # 20% Education Match default
    status = Column(String(50), default="Active", index=True) # "Active", "Draft", "Closed"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

class Candidate(Base):
    __tablename__ = "candidates"

    candidate_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, index=True)
    email = Column(String(150), nullable=False, unique=True, index=True)
    phone = Column(String(50), nullable=True)
    education = Column(String(150), nullable=False)
    experience = Column(Float, default=0.0)             # In years
    skills = Column(Text, nullable=False)               # Comma-separated skills
    resume_text = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    candidate_id = Column(Integer, ForeignKey("candidates.candidate_id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Detailed scoring breakdown
    fit_score = Column(Float, default=0.0, index=True)
    skills_score = Column(Float, default=0.0)
    experience_score = Column(Float, default=0.0)
    education_score = Column(Float, default=0.0)
    preferred_skills_score = Column(Float, default=0.0)
    keyword_score = Column(Float, default=0.0)
    
    # Decision results
    eligibility = Column(String(50), default="Review", index=True)  # "Eligible", "Review", "Not Eligible"
    status = Column(String(50), default="Screened", index=True)     # "Screened", "Shortlisted", "Rejected", "Interview"
    missing_skills = Column(Text, default="")                       # Comma-separated or JSON list
    reason = Column(Text, default="")                               # Rejection/Eligibility explanation
    recruiter_notes = Column(Text, default="")                     # Persistent notes from recruiter
    override_reason = Column(Text, default="")                     # Recorded justification for manual overrides
    applied_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    # Relationships
    candidate = relationship("Candidate", back_populates="applications")
    job = relationship("Job", back_populates="applications")

# ADSA Indexed Candidate Search Concept: Composite index on applications for high-speed multi-criteria filtering
Index("idx_app_job_score", Application.job_id, Application.fit_score.desc())
Index("idx_app_eligibility_status", Application.eligibility, Application.status)
