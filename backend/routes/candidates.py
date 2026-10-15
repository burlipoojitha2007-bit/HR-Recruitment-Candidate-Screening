from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_

from database import get_db
from models import Candidate, Application, Job
from schemas import CandidateCreate, CandidateUpdate, CandidateResponse

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.get("", response_model=List[CandidateResponse])
def get_candidates(
    search: Optional[str] = Query(None, description="Search by candidate name, skills, or education"),
    skill: Optional[str] = Query(None, description="Filter candidates containing specific skill"),
    min_exp: Optional[float] = Query(None, description="Minimum years of experience"),
    db: Session = Depends(get_db)
):
    """
    Candidate filtering query using SQL and indexed columns.
    """
    query = db.query(Candidate)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Candidate.name.ilike(pattern),
                Candidate.skills.ilike(pattern),
                Candidate.education.ilike(pattern),
                Candidate.email.ilike(pattern)
            )
        )

    if skill:
        query = query.filter(Candidate.skills.ilike(f"%{skill}%"))

    if min_exp is not None:
        query = query.filter(Candidate.experience >= min_exp)

    candidates = query.order_by(desc(Candidate.created_at)).all()
    return candidates

@router.get("/{candidate_id}")
def get_candidate_profile(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Fetch applications with corresponding job details
    apps = db.query(Application, Job).join(Job, Application.job_id == Job.job_id).filter(
        Application.candidate_id == candidate_id
    ).all()

    app_list = []
    for app, job in apps:
        app_list.append({
            "application_id": app.application_id,
            "job_id": job.job_id,
            "job_title": job.title,
            "department": job.department,
            "fit_score": app.fit_score,
            "skills_score": app.skills_score,
            "experience_score": app.experience_score,
            "education_score": app.education_score,
            "preferred_skills_score": app.preferred_skills_score,
            "keyword_score": app.keyword_score,
            "eligibility": app.eligibility,
            "status": app.status,
            "missing_skills": [s.strip() for s in app.missing_skills.split(",")] if app.missing_skills else [],
            "reason": app.reason,
            "applied_at": app.applied_at
        })

    return {
        "candidate_id": candidate.candidate_id,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "education": candidate.education,
        "experience": candidate.experience,
        "skills": candidate.skills,
        "resume_text": candidate.resume_text,
        "created_at": candidate.created_at,
        "applications": app_list
    }

@router.post("", response_model=CandidateResponse, status_code=201)
def create_candidate(candidate_in: CandidateCreate, db: Session = Depends(get_db)):
    # Check if candidate email already exists
    existing = db.query(Candidate).filter(Candidate.email == candidate_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Candidate with this email already exists")

    new_candidate = Candidate(
        name=candidate_in.name.strip(),
        email=candidate_in.email.strip(),
        phone=candidate_in.phone.strip() if candidate_in.phone else "",
        education=candidate_in.education.strip(),
        experience=candidate_in.experience,
        skills=candidate_in.skills.strip(),
        resume_text=candidate_in.resume_text or ""
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)
    return new_candidate

@router.put("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(candidate_id: int, candidate_in: CandidateUpdate, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if candidate_in.name is not None:
        candidate.name = candidate_in.name.strip()
    if candidate_in.email is not None:
        # Check uniqueness if changed
        if candidate_in.email != candidate.email:
            existing = db.query(Candidate).filter(Candidate.email == candidate_in.email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Another candidate with this email exists")
            candidate.email = candidate_in.email.strip()
    if candidate_in.phone is not None:
        candidate.phone = candidate_in.phone.strip()
    if candidate_in.education is not None:
        candidate.education = candidate_in.education.strip()
    if candidate_in.experience is not None:
        candidate.experience = candidate_in.experience
    if candidate_in.skills is not None:
        candidate.skills = candidate_in.skills.strip()
    if candidate_in.resume_text is not None:
        candidate.resume_text = candidate_in.resume_text

    db.commit()
    db.refresh(candidate)
    return candidate

@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.candidate_id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Cascaded delete of applications
    db.delete(candidate)
    db.commit()
    return {"message": f"Candidate #{candidate_id} and associated applications successfully removed", "success": True}

