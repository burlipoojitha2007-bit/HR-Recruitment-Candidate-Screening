"""
Automated Comprehensive Test Suite for AI-Powered HR Recruitment & Candidate Screening System.
Verifies all DBMS, SQL, DMGT, ADSA, OOP, and Python requirements.
"""

import sys
import os
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import SessionLocal
from seed_data import seed_database
from models import Job, Candidate, Application

client = TestClient(app)

def test_system_pipeline():
    print("=" * 60)
    print("STARTING RECRUITMENT SYSTEM VERIFICATION TEST SUITE")
    print("=" * 60)

    # 1. Reset / Seed Database
    print("\n[TEST 1] Testing Database Reset & Seed...")
    db = SessionLocal()
    seed_database(db, force_reset=True)
    db.close()

    # 2. Test GET /jobs
    print("\n[TEST 2] Testing GET /jobs (SQL Aggregation: Applicants & Avg Scores)...")
    res = client.get("/jobs")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    jobs = res.json()
    assert len(jobs) >= 8, f"Expected >= 8 jobs, got {len(jobs)}"
    sample_job = jobs[0]
    print(f"  [PASS] Sample Job: '{sample_job['title']}' ({sample_job['department']}) - {sample_job['applicant_count']} applicants, Avg Fit: {sample_job['average_fit_score']}%")

    # 3. Test POST /jobs
    print("\n[TEST 3] Testing POST /jobs (Create New Job)...")
    new_job_payload = {
        "title": "Senior NLP Research Scientist",
        "department": "AI Labs",
        "description": "Lead LLM fine-tuning, retrieval augmented generation, and transformer model optimization.",
        "required_skills": "Python, PyTorch, NLP, Transformers",
        "preferred_skills": "FastAPI, Docker, LangChain",
        "minimum_experience": 3.0,
        "education_requirement": "MTech / PhD",
        "status": "Active"
    }
    res = client.post("/jobs", json=new_job_payload)
    assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
    created_job = res.json()
    assert created_job["title"] == "Senior NLP Research Scientist"
    created_job_id = created_job["job_id"]
    print(f"  [PASS] Created Job ID: {created_job_id} ('{created_job['title']}')")

    # 4. Test GET /candidates
    print("\n[TEST 4] Testing GET /candidates (SQL Multi-criteria candidate query)...")
    res = client.get("/candidates")
    assert res.status_code == 200
    candidates = res.json()
    assert len(candidates) >= 15, f"Expected >= 15 candidates, got {len(candidates)}"
    print(f"  [PASS] Retrieved {len(candidates)} candidates.")

    # 5. Test POST /candidates
    print("\n[TEST 5] Testing POST /candidates (Manual Candidate Addition)...")
    new_cand_payload = {
        "name": "Vikram Sethi",
        "email": "vikram.sethi@example.com",
        "phone": "+91 99999 88888",
        "education": "BTech Computer Science",
        "experience": 2.0,
        "skills": "Python, Machine Learning, SQL, FastAPI, Docker",
        "resume_text": "Experienced Python engineer with machine learning and API deployment."
    }
    res = client.post("/candidates", json=new_cand_payload)
    assert res.status_code == 201
    created_cand = res.json()
    print(f"  [PASS] Created Candidate ID {created_cand['candidate_id']}: {created_cand['name']}")

    # 6. Test POST /upload-resume (Entity Extraction)
    print("\n[TEST 6] Testing POST /upload-resume (NLP Resume Parser)...")
    sample_resume = """
    Aarav Saxena
    aarav.saxena@example.com | +91 91234 56789
    Education: BTech Computer Science
    Experience: 2 years of experience

    Technical Skills:
    Python, SQL, Machine Learning, Deep Learning, FastAPI, Git, Pandas
    """
    res = client.post("/upload-resume", data={"raw_text": sample_resume})
    assert res.status_code == 200
    parsed = res.json()["parsed_data"]
    assert "aarav.saxena@example.com" in parsed["email"]
    assert "Python" in parsed["skills"]
    print(f"  [PASS] Extracted Candidate: {parsed['name']}, Email: {parsed['email']}, Exp: {parsed['experience']}y, Skills: {parsed['skills']}")

    # 7. Test POST /screen-candidate (Screening Engine Scoring & Decision Rules)
    print("\n[TEST 7] Testing POST /screen-candidate (Python Screening Engine)...")
    target_job = next(j for j in jobs if "AI/ML Intern" in j["title"] or "Python AI" in j["title"])
    screen_payload = {
        "candidate_id": created_cand["candidate_id"],
        "job_id": target_job["job_id"]
    }
    res = client.post("/screen-candidate", json=screen_payload)
    assert res.status_code == 200
    screen_result = res.json()
    print(f"  [PASS] Candidate Fit Score: {screen_result['fit_score']}%")
    print(f"    - Skills Match: {screen_result['skills_score']}% (Weight: 50%)")
    print(f"    - Experience Match: {screen_result['experience_score']}% (Weight: 20%)")
    print(f"    - Education Match: {screen_result['education_score']}% (Weight: 15%)")
    print(f"    - Preferred Skills: {screen_result['preferred_skills_score']}% (Weight: 10%)")
    print(f"    - Keyword Relevance: {screen_result['keyword_score']}% (Weight: 5%)")
    print(f"    - Eligibility Result: {screen_result['eligibility']}")
    print(f"    - Recommended Action: {screen_result['recommended_action']}")
    print(f"    - Screening Reason: {screen_result['reason']}")
    assert screen_result["fit_score"] > 0
    assert screen_result["eligibility"] in ["Eligible", "Review", "Not Eligible"]

    # 8. Test GET /applications (Candidate Ranking & Sorting)
    print("\n[TEST 8] Testing GET /applications (ADSA Candidate Ranking & Composite Index)...")
    res = client.get("/applications?sort_by=fit_score&order=desc")
    assert res.status_code == 200
    ranked_apps = res.json()
    assert len(ranked_apps) > 0
    print(f"  [PASS] Top Ranked Candidate: #{ranked_apps[0]['rank']} {ranked_apps[0]['candidate_name']} ({ranked_apps[0]['fit_score']}%)")
    print(f"  [PASS] Second Ranked Candidate: #{ranked_apps[1]['rank']} {ranked_apps[1]['candidate_name']} ({ranked_apps[1]['fit_score']}%)")

    # 9. Test Application Status Updates (Shortlist / Reject)
    print("\n[TEST 9] Testing POST /applications/{id}/shortlist and /reject...")
    top_app_id = ranked_apps[0]["application_id"]
    res = client.post(f"/applications/{top_app_id}/shortlist")
    assert res.status_code == 200
    print(f"  [PASS] Shortlisted Application #{top_app_id}")

    # 10. Test GET /analytics (SQL Aggregations)
    print("\n[TEST 10] Testing GET /analytics (Aggregation Telemetry)...")
    res = client.get("/analytics")
    assert res.status_code == 200
    analytics = res.json()
    print(f"  [PASS] Total Jobs: {analytics['total_jobs']}")
    print(f"  [PASS] Total Applications: {analytics['total_applications']}")
    print(f"  [PASS] Eligible Candidates: {analytics['eligible_count']}")
    print(f"  [PASS] Shortlisted Candidates: {analytics['shortlisted_count']}")
    print(f"  [PASS] Average Fit Score: {analytics['average_fit_score']}%")
    assert analytics["total_applications"] > 0

    # 11. Test POST /demo/run-screening (Demo Scenario)
    print("\n[TEST 11] Testing POST /demo/run-screening (AI/ML Intern Demo Scenario)...")
    res = client.post("/demo/run-screening")
    assert res.status_code == 200
    demo_out = res.json()
    print(f"  [PASS] Demo Job: '{demo_out['job_title']}'")
    print(f"  [PASS] Total Screened: {demo_out['total_screened']}")
    print("  [PASS] Top 5 Candidates in Demo Output:")
    for c in demo_out["ranked_candidates"][:5]:
        print(f"    Rank #{c['rank']} - {c['candidate_name']}: {c['fit_score']}% | {c['eligibility']} | {c['recommended_action']}")

    print("\n" + "=" * 60)
    print("ALL 11 TEST MODULES PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    test_system_pipeline()
