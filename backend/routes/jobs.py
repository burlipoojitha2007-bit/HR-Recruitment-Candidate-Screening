from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from database import get_db
from models import Job, Application, Candidate
from schemas import JobCreate, JobUpdate, JobResponse, ApplicationResponse

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def get_jobs(
    search: Optional[str] = Query(None, description="Search jobs by title, department, or skills"),
    status: Optional[str] = Query(None, description="Filter by status (Active, Closed, Draft)"),
    db: Session = Depends(get_db)
):
    """
    SQL Aggregation Query:
    Retrieves jobs along with calculated applicant count and average fit score.
    """
    query = db.query(
        Job,
        func.count(Application.application_id).label("applicant_count"),
        func.coalesce(func.avg(Application.fit_score), 0.0).label("average_fit_score")
    ).outerjoin(Application, Job.job_id == Application.job_id).group_by(Job.job_id)

    if status and status.lower() != "all":
        query = query.filter(Job.status == status)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Job.title.ilike(search_pattern)) |
            (Job.department.ilike(search_pattern)) |
            (Job.required_skills.ilike(search_pattern))
        )

    results = query.order_by(desc(Job.created_at)).all()

    job_list = []
    for job, applicant_count, avg_fit in results:
        job_data = JobResponse(
            job_id=job.job_id,
            title=job.title,
            department=job.department,
            description=job.description,
            required_skills=job.required_skills,
            preferred_skills=job.preferred_skills,
            minimum_experience=job.minimum_experience,
            education_requirement=job.education_requirement,
            status=job.status,
            created_at=job.created_at,
            applicant_count=applicant_count,
            average_fit_score=round(float(avg_fit), 1)
        )
        job_list.append(job_data)

    return job_list

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    result = db.query(
        Job,
        func.count(Application.application_id).label("applicant_count"),
        func.coalesce(func.avg(Application.fit_score), 0.0).label("average_fit_score")
    ).outerjoin(Application, Job.job_id == Application.job_id).filter(Job.job_id == job_id).group_by(Job.job_id).first()

    if not result:
        raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found")

    job, applicant_count, avg_fit = result
    return JobResponse(
        job_id=job.job_id,
        title=job.title,
        department=job.department,
        description=job.description,
        required_skills=job.required_skills,
        preferred_skills=job.preferred_skills,
        minimum_experience=job.minimum_experience,
        education_requirement=job.education_requirement,
        status=job.status,
        created_at=job.created_at,
        applicant_count=applicant_count,
        average_fit_score=round(float(avg_fit), 1)
    )

@router.post("", response_model=JobResponse, status_code=201)
def create_job(job_in: JobCreate, db: Session = Depends(get_db)):
    if not job_in.title.strip():
        raise HTTPException(status_code=400, detail="Job title is required")
    if not job_in.required_skills.strip():
        raise HTTPException(status_code=400, detail="Required skills are mandatory")

    new_job = Job(
        title=job_in.title.strip(),
        department=job_in.department.strip() or "General Engineering",
        description=job_in.description.strip(),
        required_skills=job_in.required_skills.strip(),
        preferred_skills=job_in.preferred_skills.strip() if job_in.preferred_skills else "",
        minimum_experience=job_in.minimum_experience,
        education_requirement=job_in.education_requirement.strip(),
        status=job_in.status or "Active"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return JobResponse(
        job_id=new_job.job_id,
        title=new_job.title,
        department=new_job.department,
        description=new_job.description,
        required_skills=new_job.required_skills,
        preferred_skills=new_job.preferred_skills,
        minimum_experience=new_job.minimum_experience,
        education_requirement=new_job.education_requirement,
        status=new_job.status,
        created_at=new_job.created_at,
        applicant_count=0,
        average_fit_score=0.0
    )

@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job_update: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    update_data = job_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(job, field, val)

    db.commit()
    db.refresh(job)

    # Re-fetch aggregated stats
    applicant_count = db.query(func.count(Application.application_id)).filter(Application.job_id == job_id).scalar() or 0
    avg_score = db.query(func.avg(Application.fit_score)).filter(Application.job_id == job_id).scalar() or 0.0

    return JobResponse(
        job_id=job.job_id,
        title=job.title,
        department=job.department,
        description=job.description,
        required_skills=job.required_skills,
        preferred_skills=job.preferred_skills,
        minimum_experience=job.minimum_experience,
        education_requirement=job.education_requirement,
        status=job.status,
        created_at=job.created_at,
        applicant_count=applicant_count,
        average_fit_score=round(float(avg_score), 1)
    )

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": f"Job {job_id} deleted successfully"}
