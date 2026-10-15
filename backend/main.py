import os
import shutil
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import engine, Base, get_db, SessionLocal
from models import Job, Candidate, Application
from schemas import (
    ScreenCandidateRequest,
    ScreenResultResponse,
    ApplicationResponse,
    JobResponse
)
from screening_engine import ScreeningEngine
from resume_parser import ResumeParser
from seed_data import seed_database

# Import routers
from routes.jobs import router as jobs_router
from routes.candidates import router as candidates_router
from routes.applications import router as applications_router
from routes.analytics import router as analytics_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty on startup
with SessionLocal() as db_session:
    seed_database(db_session, force_reset=False)

app = FastAPI(
    title="AI-Powered HR Recruitment & Candidate Screening System API",
    description="Automated resume screening, candidate ranking, qualification fit scoring, and recruitment management.",
    version="1.0.0"
)

# Enable CORS for React Vite frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(jobs_router)
app.include_router(candidates_router)
app.include_router(applications_router)
app.include_router(analytics_router)

screening_engine = ScreeningEngine()

@app.get("/api/health")
def api_health():
    return {
        "status": "online",
        "system": "AI-Powered HR Recruitment & Candidate Screening System",
        "version": "1.0.0",
        "docs": "/docs"
    }

# ==================== RESUME UPLOAD & PARSING ====================
@app.post("/upload-resume")
async def upload_resume(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None)
):
    """
    Accepts PDF, TXT resume file or raw pasted text.
    Extracts candidate contact details, skills, education, and experience.
    """
    extracted_text = ""

    if file:
        content = await file.read()
        filename = file.filename.lower() if file.filename else "resume.txt"
        if filename.endswith(".pdf"):
            extracted_text = ResumeParser.extract_text_from_pdf(content)
        else:
            try:
                extracted_text = content.decode("utf-8", errors="ignore")
            except Exception:
                extracted_text = str(content)
    elif raw_text:
        extracted_text = raw_text
    else:
        raise HTTPException(status_code=400, detail="Please upload a resume file (.pdf, .txt) or paste resume text.")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the provided resume.")

    parsed_data = ResumeParser.parse_resume(extracted_text)
    return {
        "success": True,
        "parsed_data": parsed_data,
        "extracted_text_preview": extracted_text[:500] + ("..." if len(extracted_text) > 500 else "")
    }

# ==================== CANDIDATE SCREENING ====================
@app.post("/screen-candidate", response_model=ScreenResultResponse)
def screen_candidate(
    payload: ScreenCandidateRequest,
    db: Session = Depends(get_db)
):
    """
    Evaluates candidate against a selected Job Opening.
    Computes fit score (0-100), individual sub-scores, eligibility, missing skills, and explains rationale.
    Optionally saves or updates application in SQLite.
    """
    job = db.query(Job).filter(Job.job_id == payload.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Target job not found")

    # If candidate_id is provided, fetch existing candidate
    cand = None
    if payload.candidate_id:
        cand = db.query(Candidate).filter(Candidate.candidate_id == payload.candidate_id).first()

    cand_skills = cand.skills if cand else (payload.candidate_skills or "")
    cand_exp = cand.experience if cand else (payload.candidate_experience or 0.0)
    cand_edu = cand.education if cand else (payload.candidate_education or "BTech")
    cand_resume = cand.resume_text if cand else (payload.resume_text or "")
    cand_name = cand.name if cand else (payload.candidate_name or "Candidate")
    cand_email = cand.email if cand else (payload.candidate_email or f"applicant_{os.urandom(2).hex()}@example.com")
    cand_phone = cand.phone if cand else (payload.candidate_phone or "")

    # Execute screening algorithm
    result = screening_engine.screen(
        candidate_skills_raw=cand_skills,
        candidate_exp=cand_exp,
        candidate_edu=cand_edu,
        candidate_resume=cand_resume,
        required_skills_raw=job.required_skills,
        preferred_skills_raw=job.preferred_skills,
        required_exp=job.minimum_experience,
        required_edu=job.education_requirement,
        job_description=job.description
    )

    # Determine recommended action
    if result["eligibility"] == "Eligible":
        recommended_action = "SHORTLIST"
    elif result["eligibility"] == "Review":
        recommended_action = "REVIEW"
    else:
        recommended_action = "REJECT"

    application_id = None
    if payload.auto_save:
        # Create or update candidate if needed
        if not cand:
            cand = db.query(Candidate).filter(Candidate.email == cand_email).first()
            if not cand:
                cand = Candidate(
                    name=cand_name,
                    email=cand_email,
                    phone=cand_phone,
                    education=cand_edu,
                    experience=cand_exp,
                    skills=cand_skills,
                    resume_text=cand_resume
                )
                db.add(cand)
                db.commit()
                db.refresh(cand)

        # Check existing application for this candidate & job
        app_record = db.query(Application).filter(
            Application.candidate_id == cand.candidate_id,
            Application.job_id == job.job_id
        ).first()

        initial_status = "Shortlisted" if result["eligibility"] == "Eligible" else (
            "Rejected" if result["eligibility"] == "Not Eligible" else "Screened"
        )

        if not app_record:
            app_record = Application(
                candidate_id=cand.candidate_id,
                job_id=job.job_id,
                fit_score=result["fit_score"],
                skills_score=result["skills_score"],
                experience_score=result["experience_score"],
                education_score=result["education_score"],
                preferred_skills_score=result["preferred_skills_score"],
                keyword_score=result["keyword_score"],
                eligibility=result["eligibility"],
                status=initial_status,
                missing_skills=", ".join(result["missing_skills"]),
                reason=result["reason"]
            )
            db.add(app_record)
        else:
            app_record.fit_score = result["fit_score"]
            app_record.skills_score = result["skills_score"]
            app_record.experience_score = result["experience_score"]
            app_record.education_score = result["education_score"]
            app_record.preferred_skills_score = result["preferred_skills_score"]
            app_record.keyword_score = result["keyword_score"]
            app_record.eligibility = result["eligibility"]
            app_record.missing_skills = ", ".join(result["missing_skills"])
            app_record.reason = result["reason"]

        db.commit()
        db.refresh(app_record)
        application_id = app_record.application_id

    return ScreenResultResponse(
        fit_score=result["fit_score"],
        skills_score=result["skills_score"],
        experience_score=result["experience_score"],
        education_score=result["education_score"],
        preferred_skills_score=result["preferred_skills_score"],
        keyword_score=result["keyword_score"],
        eligibility=result["eligibility"],
        missing_skills=result["missing_skills"],
        reason=result["reason"],
        recommended_action=recommended_action,
        application_id=application_id
    )

# ==================== DEMO MODE WORKFLOW ====================
@app.post("/demo/run-screening")
def run_demo_screening(db: Session = Depends(get_db)):
    """
    Executes the Demo Scenario:
    1. Selects or ensures the default job 'AI/ML Intern'
    2. Runs the screening engine across sample candidates (Candidate A, B, C, D, E...)
    3. Produces ranked candidate output with fit scores and eligibility
    """
    job = db.query(Job).filter(Job.title.ilike("%AI/ML Intern%")).first()
    if not job:
        job = db.query(Job).first()

    if not job:
        seed_database(db, force_reset=True)
        job = db.query(Job).filter(Job.title.ilike("%AI/ML Intern%")).first()

    # Screen all existing candidates against this job
    candidates = db.query(Candidate).all()
    results = []
    for cand in candidates:
        res = screening_engine.screen(
            candidate_skills_raw=cand.skills,
            candidate_exp=cand.experience,
            candidate_edu=cand.education,
            candidate_resume=cand.resume_text,
            required_skills_raw=job.required_skills,
            preferred_skills_raw=job.preferred_skills,
            required_exp=job.minimum_experience,
            required_edu=job.education_requirement,
            job_description=job.description
        )

        # Update or insert application
        app_rec = db.query(Application).filter(
            Application.candidate_id == cand.candidate_id,
            Application.job_id == job.job_id
        ).first()

        status = "Shortlisted" if res["eligibility"] == "Eligible" else (
            "Rejected" if res["eligibility"] == "Not Eligible" else "Review"
        )

        if not app_rec:
            app_rec = Application(
                candidate_id=cand.candidate_id,
                job_id=job.job_id,
                fit_score=res["fit_score"],
                skills_score=res["skills_score"],
                experience_score=res["experience_score"],
                education_score=res["education_score"],
                preferred_skills_score=res["preferred_skills_score"],
                keyword_score=res["keyword_score"],
                eligibility=res["eligibility"],
                status=status,
                missing_skills=", ".join(res["missing_skills"]),
                reason=res["reason"]
            )
            db.add(app_rec)
        else:
            app_rec.fit_score = res["fit_score"]
            app_rec.skills_score = res["skills_score"]
            app_rec.experience_score = res["experience_score"]
            app_rec.education_score = res["education_score"]
            app_rec.preferred_skills_score = res["preferred_skills_score"]
            app_rec.keyword_score = res["keyword_score"]
            app_rec.eligibility = res["eligibility"]
            app_rec.status = status
            app_rec.missing_skills = ", ".join(res["missing_skills"])
            app_rec.reason = res["reason"]

        db.commit()

        results.append({
            "candidate_id": cand.candidate_id,
            "candidate_name": cand.name,
            "education": cand.education,
            "experience": cand.experience,
            "skills": cand.skills,
            "fit_score": res["fit_score"],
            "eligibility": res["eligibility"],
            "missing_skills": res["missing_skills"],
            "reason": res["reason"],
            "recommended_action": "SHORTLIST" if res["eligibility"] == "Eligible" else (
                "REVIEW" if res["eligibility"] == "Review" else "REJECT"
            )
        })

    # Rank results by fit score descending
    results.sort(key=lambda x: x["fit_score"], reverse=True)
    for idx, r in enumerate(results, start=1):
        r["rank"] = idx

    return {
        "success": True,
        "job_id": job.job_id,
        "job_title": job.title,
        "required_skills": job.required_skills,
        "preferred_skills": job.preferred_skills,
        "total_screened": len(results),
        "ranked_candidates": results
    }

@app.post("/demo/reset")
def reset_demo_database(db: Session = Depends(get_db)):
    """Resets database and re-seeds all initial sample records."""
    seed_database(db, force_reset=True)
    return {"message": "Database successfully reset and re-seeded with 8 jobs and 16 candidates."}

# ==================== B-TREE CANDIDATE INDEXING DEMO ====================
from btree_index import CandidateBTree

@app.get("/api/btree/index")
def get_btree_index(db: Session = Depends(get_db)):
    """
    Builds an in-memory B-Tree index (Order m=3) on Candidate IDs and returns its hierarchical node structure.
    Academic demonstration for ADSA viva.
    """
    candidates = db.query(Candidate).order_by(Candidate.candidate_id).all()
    btree = CandidateBTree(order=3)
    for c in candidates:
        btree.insert(c.candidate_id, {
            "candidate_id": c.candidate_id,
            "name": c.name,
            "education": c.education,
            "experience": c.experience,
            "skills": c.skills
        })
    return {
        "success": True,
        "order": btree.order,
        "total_indexed": len(candidates),
        "tree": btree.get_tree_structure(),
        "disclaimer": "Educational demonstration authored by project team. SQLite uses separate native C B-Tree."
    }

@app.post("/api/btree/search")
def search_btree_index(payload: dict, db: Session = Depends(get_db)):
    """
    Executes a key search on the B-Tree index, recording comparisons and node traversals.
    Compares against a naive sequential scan.
    """
    candidate_id = int(payload.get("candidate_id", 1))
    candidates = db.query(Candidate).order_by(Candidate.candidate_id).all()
    btree = CandidateBTree(order=3)
    for c in candidates:
        btree.insert(c.candidate_id, {
            "candidate_id": c.candidate_id,
            "name": c.name,
            "education": c.education,
            "experience": c.experience,
            "skills": c.skills
        })

    result = btree.search_with_trace(candidate_id, len(candidates))
    return result

# ==================== SKILLS DISTRIBUTION FOR RECHARTS ====================
@app.get("/api/skills/distribution")
def get_skills_distribution(db: Session = Depends(get_db)):
    """
    Aggregates candidate skill occurrences for the Recharts Skills Distribution Chart.
    """
    candidates = db.query(Candidate).all()
    skill_counts = {}
    for cand in candidates:
        if cand.skills:
            for s in cand.skills.split(","):
                clean = s.strip()
                if clean:
                    skill_counts[clean] = skill_counts.get(clean, 0) + 1

    # Sort descending
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    return [
        {"skill": k, "count": v}
        for k, v in sorted_skills
    ]

# ==================== CONSOLIDATED DASHBOARD API ====================
@app.get("/api/dashboard")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Single aggregated dashboard API endpoint returning all required statistics:
    - total_candidates, eligible, shortlisted, review_needed, average fit score
    - candidate pipeline
    - top skills
    - recent activity
    """
    total_candidates = db.query(Candidate).count()
    total_jobs = db.query(Job).count()
    total_apps = db.query(Application).count()

    eligible_count = db.query(Application).filter(Application.eligibility == "Eligible").count()
    review_count = db.query(Application).filter(Application.eligibility == "Review").count()
    not_eligible_count = db.query(Application).filter(Application.eligibility == "Not Eligible").count()

    shortlisted_count = db.query(Application).filter(Application.status == "Shortlisted").count()
    interview_count = db.query(Application).filter(Application.status == "Interview").count()
    rejected_count = db.query(Application).filter(Application.status == "Rejected").count()
    screened_count = db.query(Application).filter(Application.status == "Screened").count()

    from sqlalchemy import func
    avg_score = db.query(func.avg(Application.fit_score)).scalar() or 0.0

    # Pipeline stages
    pipeline = [
        {"stage": "Applied", "count": total_candidates, "fill": "#6366f1"},
        {"stage": "Screened", "count": screened_count + shortlisted_count + interview_count + rejected_count, "fill": "#3b82f6"},
        {"stage": "Eligible", "count": eligible_count, "fill": "#10b981"},
        {"stage": "Review Needed", "count": review_count, "fill": "#f59e0b"},
        {"stage": "Shortlisted", "count": shortlisted_count, "fill": "#8b5cf6"},
        {"stage": "Interview", "count": interview_count, "fill": "#06b6d4"}
    ]

    # Skills distribution
    skill_counts = {}
    for cand in db.query(Candidate).all():
        if cand.skills:
            for s in cand.skills.split(","):
                clean = s.strip()
                if clean:
                    skill_counts[clean] = skill_counts.get(clean, 0) + 1
    top_skills = [
        {"skill": k, "count": v}
        for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:8]
    ]

    # Recent activity
    recent = db.query(Application, Candidate, Job).join(
        Candidate, Application.candidate_id == Candidate.candidate_id
    ).join(
        Job, Application.job_id == Job.job_id
    ).order_by(Application.applied_at.desc()).limit(6).all()

    recent_activity = [
        {
            "application_id": app.application_id,
            "candidate_name": cand.name,
            "job_title": job.title,
            "fit_score": app.fit_score,
            "eligibility": app.eligibility,
            "status": app.status,
            "applied_at": app.applied_at
        }
        for app, cand, job in recent
    ]

    return {
        "total_candidates": total_candidates,
        "total_jobs": total_jobs,
        "total_applications": total_apps,
        "eligible_candidates": eligible_count,
        "shortlisted_candidates": shortlisted_count,
        "review_needed_candidates": review_count,
        "not_eligible_candidates": not_eligible_count,
        "average_fit_score": round(float(avg_score), 1),
        "pipeline": pipeline,
        "top_skills": top_skills,
        "recent_activity": recent_activity
    }


# ==================== STATIC FILES & PRODUCTION SPA ====================
FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json"]:
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
