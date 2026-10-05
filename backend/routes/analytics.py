from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, case

from database import get_db
from models import Job, Candidate, Application

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
def get_analytics_overview(db: Session = Depends(get_db)):
    """
    SQL Aggregation Queries for Recruiter Dashboard and Analytics:
    - Counts, averages, grouped distributions, and pipeline velocity.
    """
    total_jobs = db.query(Job).count()
    total_candidates = db.query(Candidate).count()
    total_applications = db.query(Application).count()

    # Aggregate counts by eligibility
    eligible_count = db.query(Application).filter(Application.eligibility == "Eligible").count()
    review_count = db.query(Application).filter(Application.eligibility == "Review").count()
    not_eligible_count = db.query(Application).filter(Application.eligibility == "Not Eligible").count()

    # Aggregate counts by status
    shortlisted_count = db.query(Application).filter(Application.status == "Shortlisted").count()
    rejected_count = db.query(Application).filter(Application.status == "Rejected").count()
    interview_count = db.query(Application).filter(Application.status == "Interview").count()
    screened_count = db.query(Application).filter(Application.status == "Screened").count()

    # Average fit score
    avg_score = db.query(func.avg(Application.fit_score)).scalar() or 0.0

    # Score Distribution buckets
    # <50 (Not Eligible), 50-74 (Review), 75-89 (Strong), 90-100 (Exceptional)
    bucket_90_100 = db.query(Application).filter(Application.fit_score >= 90).count()
    bucket_75_89 = db.query(Application).filter(Application.fit_score >= 75, Application.fit_score < 90).count()
    bucket_50_74 = db.query(Application).filter(Application.fit_score >= 50, Application.fit_score < 75).count()
    bucket_0_49 = db.query(Application).filter(Application.fit_score < 50).count()

    score_distribution = [
        {"range": "90-100% (High Fit)", "count": bucket_90_100},
        {"range": "75-89% (Good Fit)", "count": bucket_75_89},
        {"range": "50-74% (Review)", "count": bucket_50_74},
        {"range": "< 50% (Low Fit)", "count": bucket_0_49}
    ]

    eligibility_breakdown = [
        {"name": "Eligible", "value": eligible_count, "color": "#10B981"},
        {"name": "Review Needed", "value": review_count, "color": "#F59E0B"},
        {"name": "Not Eligible", "value": not_eligible_count, "color": "#EF4444"}
    ]

    status_breakdown = [
        {"status": "Shortlisted", "count": shortlisted_count, "color": "#10B981"},
        {"status": "Interview", "count": interview_count, "color": "#6366F1"},
        {"status": "Under Review", "count": review_count, "color": "#F59E0B"},
        {"status": "Screened", "count": screened_count, "color": "#3B82F6"},
        {"status": "Rejected", "count": rejected_count, "color": "#EF4444"}
    ]

    # Top Jobs with most applicants & average scores
    top_jobs_query = db.query(
        Job.job_id,
        Job.title,
        Job.department,
        func.count(Application.application_id).label("applicants"),
        func.coalesce(func.avg(Application.fit_score), 0.0).label("avg_score")
    ).outerjoin(Application, Job.job_id == Application.job_id).group_by(Job.job_id).order_by(
        desc("applicants")
    ).limit(6).all()

    top_jobs = [
        {
            "job_id": j.job_id,
            "title": j.title,
            "department": j.department,
            "applicants": j.applicants,
            "avg_score": round(float(j.avg_score), 1)
        }
        for j in top_jobs_query
    ]

    # Recent 6 screened applications
    recent_apps_query = db.query(Application, Candidate, Job).join(
        Candidate, Application.candidate_id == Candidate.candidate_id
    ).join(
        Job, Application.job_id == Job.job_id
    ).order_by(desc(Application.applied_at)).limit(6).all()

    recent_applications = [
        {
            "application_id": app.application_id,
            "candidate_name": cand.name,
            "candidate_email": cand.email,
            "job_title": job.title,
            "fit_score": app.fit_score,
            "eligibility": app.eligibility,
            "status": app.status,
            "applied_at": app.applied_at
        }
        for app, cand, job in recent_apps_query
    ]

    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "total_applications": total_applications,
        "eligible_count": eligible_count,
        "review_count": review_count,
        "not_eligible_count": not_eligible_count,
        "shortlisted_count": shortlisted_count,
        "rejected_count": rejected_count,
        "interview_count": interview_count,
        "average_fit_score": round(float(avg_score), 1),
        "score_distribution": score_distribution,
        "eligibility_breakdown": eligibility_breakdown,
        "status_breakdown": status_breakdown,
        "top_jobs": top_jobs,
        "recent_applications": recent_applications
    }
