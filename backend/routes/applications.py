from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_

from database import get_db
from models import Application, Candidate, Job
from schemas import ApplicationStatusUpdate

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("")
def get_applications(
    job_id: Optional[int] = Query(None, description="Filter by Job ID"),
    eligibility: Optional[str] = Query(None, description="Filter by Eligibility (Eligible, Review, Not Eligible)"),
    status: Optional[str] = Query(None, description="Filter by Status (Screened, Shortlisted, Rejected, Interview)"),
    min_score: Optional[float] = Query(None, description="Minimum Fit Score threshold"),
    search: Optional[str] = Query(None, description="Search candidate name or skill"),
    sort_by: Optional[str] = Query("fit_score", description="Sort by: fit_score, experience, education, applied_at, name"),
    order: Optional[str] = Query("desc", description="Sort order: asc or desc"),
    db: Session = Depends(get_db)
):
    """
    Candidate Ranking & Filtering Query (SQL + ADSA concept):
    Joins Application with Candidate and Job, applies filtering predicates,
    and returns dynamically ranked candidates with full score breakdowns.
    """
    query = db.query(Application, Candidate, Job).join(
        Candidate, Application.candidate_id == Candidate.candidate_id
    ).join(
        Job, Application.job_id == Job.job_id
    )

    if job_id:
        query = query.filter(Application.job_id == job_id)

    if eligibility and eligibility.lower() != "all":
        query = query.filter(Application.eligibility == eligibility)

    if status and status.lower() != "all":
        query = query.filter(Application.status == status)

    if min_score is not None:
        query = query.filter(Application.fit_score >= min_score)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Candidate.name.ilike(search_pattern),
                Candidate.skills.ilike(search_pattern),
                Candidate.education.ilike(search_pattern),
                Job.title.ilike(search_pattern)
            )
        )

    # Sorting
    if sort_by == "fit_score":
        sort_col = Application.fit_score
    elif sort_by == "experience":
        sort_col = Candidate.experience
    elif sort_by == "education":
        sort_col = Candidate.education
    elif sort_by == "applied_at":
        sort_col = Application.applied_at
    elif sort_by == "name":
        sort_col = Candidate.name
    else:
        sort_col = Application.fit_score

    if order.lower() == "asc":
        query = query.order_by(asc(sort_col))
    else:
        query = query.order_by(desc(sort_col))

    results = query.all()

    # Assign sequential ranks based on current view/sort order
    ranked_applications = []
    for rank_idx, (app, cand, job) in enumerate(results, start=1):
        ranked_applications.append({
            "rank": rank_idx,
            "application_id": app.application_id,
            "candidate_id": cand.candidate_id,
            "candidate_name": cand.name,
            "candidate_email": cand.email,
            "candidate_phone": cand.phone,
            "education": cand.education,
            "experience": cand.experience,
            "skills": cand.skills,
            "resume_text": cand.resume_text,
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
            "recruiter_notes": app.recruiter_notes or "",
            "override_reason": app.override_reason or "",
            "applied_at": app.applied_at
        })

    return ranked_applications

@router.get("/{application_id}")
def get_application_details(application_id: int, db: Session = Depends(get_db)):
    result = db.query(Application, Candidate, Job).join(
        Candidate, Application.candidate_id == Candidate.candidate_id
    ).join(
        Job, Application.job_id == Job.job_id
    ).filter(Application.application_id == application_id).first()

    if not result:
        raise HTTPException(status_code=404, detail="Application record not found")

    app, cand, job = result
    return {
        "application_id": app.application_id,
        "candidate_id": cand.candidate_id,
        "candidate_name": cand.name,
        "candidate_email": cand.email,
        "candidate_phone": cand.phone,
        "education": cand.education,
        "experience": cand.experience,
        "skills": cand.skills,
        "resume_text": cand.resume_text,
        "job_id": job.job_id,
        "job_title": job.title,
        "department": job.department,
        "required_skills": job.required_skills,
        "preferred_skills": job.preferred_skills,
        "minimum_experience": job.minimum_experience,
        "education_requirement": job.education_requirement,
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
        "recruiter_notes": app.recruiter_notes or "",
        "override_reason": app.override_reason or "",
        "applied_at": app.applied_at
    }

@router.post("/{application_id}/shortlist")
def shortlist_candidate(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "Shortlisted"
    db.commit()
    return {"message": "Candidate successfully shortlisted", "status": "Shortlisted"}

@router.post("/{application_id}/reject")
def reject_candidate(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "Rejected"
    db.commit()
    return {"message": "Candidate application marked as rejected", "status": "Rejected"}

@router.post("/{application_id}/interview")
def schedule_interview(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "Interview"
    db.commit()
    return {"message": "Candidate interview scheduled", "status": "Interview"}

@router.post("/{application_id}/status")
def update_application_status(application_id: int, status_in: ApplicationStatusUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = status_in.status
    if status_in.notes is not None:
        app.recruiter_notes = status_in.notes
    if status_in.override_reason:
        app.override_reason = status_in.override_reason
    db.commit()
    return {
        "message": f"Application status updated to {status_in.status}",
        "status": app.status,
        "recruiter_notes": app.recruiter_notes,
        "override_reason": app.override_reason
    }

@router.post("/{application_id}/notes")
def update_application_notes(application_id: int, notes_in: dict, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.application_id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if "notes" in notes_in:
        app.recruiter_notes = str(notes_in["notes"])
    if "override_reason" in notes_in:
        app.override_reason = str(notes_in["override_reason"])
    db.commit()
    return {
        "message": "Recruiter notes successfully updated",
        "recruiter_notes": app.recruiter_notes,
        "override_reason": app.override_reason
    }
