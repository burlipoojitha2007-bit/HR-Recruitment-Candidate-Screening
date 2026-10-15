import datetime
from sqlalchemy.orm import Session
from models import Job, Candidate, Application
from screening_engine import ScreeningEngine

def seed_database(db: Session, force_reset: bool = False):
    """
    Populates SQLite database with at least 8 realistic tech jobs and 15+ candidate profiles,
    and runs the ScreeningEngine to establish applications, rankings, scores, and analytics.
    """
    existing_jobs = db.query(Job).count()
    if existing_jobs > 0 and not force_reset:
        print("[SEED] Database already contains records. Skipping seed.")
        return

    if force_reset:
        print("[SEED] Force resetting database tables...")
        db.query(Application).delete()
        db.query(Candidate).delete()
        db.query(Job).delete()
        db.commit()

    engine = ScreeningEngine()

    print("[SEED] Seeding Jobs...")
    sample_jobs = [
        Job(
            title="AI/ML Intern",
            department="AI/ML Research",
            description="Looking for an energetic AI/ML intern passionate about Python, machine learning algorithms, database querying, and neural network experimentation.",
            required_skills="Python, Machine Learning, SQL",
            preferred_skills="Pandas, NumPy, Git",
            minimum_experience=0.0,
            education_requirement="BTech / BE / MCA",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=12)
        ),
        Job(
            title="Junior Python Developer",
            department="Engineering",
            description="Looking for a Junior Python developer with solid knowledge of Python programming, SQL databases, RESTful APIs, and distributed pipelines.",
            required_skills="Python, SQL, FastAPI, Git",
            preferred_skills="Pandas, Docker, Linux",
            minimum_experience=1.0,
            education_requirement="BTech / BE / MCA / BCA",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=10)
        ),
        Job(
            title="Frontend Developer",
            department="UI/UX Engineering",
            description="Craft pixel-perfect, accessible, and high-performance user interfaces using React, JavaScript, Tailwind, and modern CSS architecture.",
            required_skills="React, JavaScript, HTML, CSS, Tailwind",
            preferred_skills="TypeScript, Next.js, Figma, Git",
            minimum_experience=1.0,
            education_requirement="BTech / BE / BCA / MCA",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=8)
        ),
        Job(
            title="Data Analyst",
            department="Business Intelligence",
            description="Analyze business operations data, build executive dashboards in PowerBI/Tableau, and extract actionable insights with SQL queries.",
            required_skills="SQL, Excel, Data Analysis, Python",
            preferred_skills="Tableau, Power BI, Statistics, Pandas",
            minimum_experience=0.0,
            education_requirement="BTech / BSc / Any Graduate",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=7)
        ),
        Job(
            title="Full Stack Web Developer",
            department="Product Development",
            description="Build scalable customer-facing SaaS applications using modern React frontend and Node.js or Python backend microservices.",
            required_skills="React, JavaScript, Node.js, SQL, HTML, CSS",
            preferred_skills="TypeScript, Tailwind, Docker, Git",
            minimum_experience=2.0,
            education_requirement="BTech / BCA / MCA",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=6)
        ),
        Job(
            title="Data Engineer",
            department="Data Platform",
            description="Architect, build, and operationalize high-throughput ETL data pipelines, data warehouses, and analytics dashboards.",
            required_skills="Python, SQL, Spark, PostgreSQL",
            preferred_skills="Airflow, AWS, Docker, Kafka",
            minimum_experience=2.0,
            education_requirement="BTech / BE / MTech",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
        ),
        Job(
            title="Cloud DevOps Engineer",
            department="Infrastructure",
            description="Manage multi-region cloud infrastructure, automate CI/CD release cycles, monitor system health, and enforce security policies.",
            required_skills="Docker, Kubernetes, AWS, Linux, CI/CD",
            preferred_skills="Terraform, Python, Bash, Prometheus",
            minimum_experience=3.0,
            education_requirement="BTech / Any Graduate",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
        ),
        Job(
            title="QA Automation Engineer",
            department="Quality Assurance",
            description="Develop test automation frameworks, write integration test suites, and perform automated regression testing.",
            required_skills="Python, Selenium, PyTest, Git",
            preferred_skills="Postman, Docker, Jenkins, SQL",
            minimum_experience=1.0,
            education_requirement="BTech / BE / BCA",
            skill_weight=0.50,
            experience_weight=0.30,
            education_weight=0.20,
            status="Active",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
        )
    ]

    for job in sample_jobs:
        db.add(job)
    db.commit()

    print("[SEED] Seeding Candidates...")
    sample_candidates = [
        # Demo specific candidates for AI/ML Intern & Python AI roles
        Candidate(
            name="Rahul Sharma",
            email="rahul.sharma@example.com",
            phone="+91 98765 43210",
            education="BTech Computer Science",
            experience=1.0,
            skills="Python, Machine Learning, SQL, Pandas, Git, FastAPI",
            resume_text="Rahul Sharma. BTech CSE with 1 year experience building machine learning models, REST APIs with FastAPI, data manipulation with Pandas, and database modeling with SQL and Git.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=6)
        ),
        Candidate(
            name="Sneha Patil",
            email="sneha.patil@example.com",
            phone="+91 98111 22334",
            education="BTech Computer Engineering",
            experience=0.5,
            skills="Python, Machine Learning, SQL, NumPy, Scikit-Learn, Git",
            resume_text="Sneha Patil. BTech Computer Engineering graduate with academic project experience in Machine Learning, Python programming, SQL databases, and NumPy data analysis.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
        ),
        Candidate(
            name="Priya Nair",
            email="priya.nair@example.com",
            phone="+91 98222 33445",
            education="MCA (Master of Computer Applications)",
            experience=1.0,
            skills="Python, SQL, Git, Linux, Flask",
            resume_text="Priya Nair. MCA with strong background in Python scripting, relational SQL database management, and basic web services. Seeking AI and software engineering roles.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
        ),
        Candidate(
            name="Kiran Verma",
            email="kiran.verma@example.com",
            phone="+91 98333 44556",
            education="BTech Information Technology",
            experience=0.0,
            skills="Python, JavaScript, HTML, CSS",
            resume_text="Kiran Verma. BTech IT fresh graduate. Good foundation in Python programming and front-end JavaScript development. Enthusiastic learner seeking an entry level role.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
        ),
        Candidate(
            name="Arjun Mehta",
            email="arjun.mehta@example.com",
            phone="+91 98444 55667",
            education="BSc Information Technology",
            experience=0.0,
            skills="Java, HTML, CSS, WordPress",
            resume_text="Arjun Mehta. BSc IT. Core competencies in Java, basic HTML/CSS design, and CMS content management.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
        ),
        # Additional Diverse Tech Candidates
        Candidate(
            name="Ananya Iyer",
            email="ananya.iyer@example.com",
            phone="+91 98555 66778",
            education="MTech Computer Science",
            experience=2.5,
            skills="Python, Machine Learning, Deep Learning, SQL, FastAPI, PyTorch, Docker, Git",
            resume_text="Ananya Iyer. MTech CS with 2.5 years of experience in computer vision, deep learning, PyTorch model deployment with FastAPI, and Dockerized microservices.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
        ),
        Candidate(
            name="Rohan Deshmukh",
            email="rohan.deshmukh@example.com",
            phone="+91 98666 77889",
            education="BTech Computer Science",
            experience=2.0,
            skills="React, JavaScript, Node.js, SQL, HTML, CSS, TypeScript, Tailwind, Git",
            resume_text="Rohan Deshmukh. Full stack engineer with 2 years of experience developing responsive web portals in React, TypeScript, Node.js, and SQL databases.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
        ),
        Candidate(
            name="Vikas Gupta",
            email="vikas.gupta@example.com",
            phone="+91 98777 88990",
            education="BTech Mechanical Engineering",
            experience=2.5,
            skills="Python, SQL, Spark, PostgreSQL, Airflow, AWS, Docker",
            resume_text="Vikas Gupta. Data Engineer with 2.5 years experience constructing data lakes, PySpark batch jobs, PostgreSQL performance optimization, and AWS data warehousing.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        Candidate(
            name="Pooja Kulkarni",
            email="pooja.kulkarni@example.com",
            phone="+91 98888 99001",
            education="BE Computer Science",
            experience=3.5,
            skills="Docker, Kubernetes, AWS, Linux, CI/CD, Terraform, Bash, Python",
            resume_text="Pooja Kulkarni. Senior DevOps engineer with 3.5 years managing AWS EKS clusters, Terraform automated infrastructure as code, and Jenkins/GitHub Actions CI/CD.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        Candidate(
            name="Aditya Reddy",
            email="aditya.reddy@example.com",
            phone="+91 98999 00112",
            education="BTech Computer Science",
            experience=1.5,
            skills="React, TypeScript, Tailwind, JavaScript, HTML, CSS, Next.js, Git",
            resume_text="Aditya Reddy. Frontend developer passionate about design systems, React, Next.js SSR, Tailwind CSS styling, and responsive web performance.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        Candidate(
            name="Meera Joshi",
            email="meera.joshi@example.com",
            phone="+91 98123 45678",
            education="BTech Electronics",
            experience=1.5,
            skills="Python, Selenium, PyTest, Git, Postman, SQL",
            resume_text="Meera Joshi. QA Automation Specialist with 1.5 years experience building end-to-end regression test suites using Selenium WebDriver, PyTest, and Postman API tests.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        Candidate(
            name="Tanmay Bhatt",
            email="tanmay.bhatt@example.com",
            phone="+91 98234 56789",
            education="BSc Statistics",
            experience=1.0,
            skills="SQL, Excel, Data Analysis, Python, Tableau, Statistics, Pandas",
            resume_text="Tanmay Bhatt. BSc Statistics with 1 year experience analyzing customer cohorts, building executive dashboards in Tableau, and running SQL queries.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        Candidate(
            name="Divya Menon",
            email="divya.menon@example.com",
            phone="+91 98345 67890",
            education="BTech Computer Science",
            experience=0.0,
            skills="Python, Machine Learning, SQL, Pandas, NumPy",
            resume_text="Divya Menon. Recent BTech graduate with coursework in machine learning, Python data science libraries (Pandas, NumPy), and relational database design.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        Candidate(
            name="Karthik Subramanian",
            email="karthik.sub@example.com",
            phone="+91 98456 78901",
            education="BCA (Bachelor of Computer Applications)",
            experience=0.5,
            skills="PHP, MySQL, HTML, CSS, JavaScript",
            resume_text="Karthik Subramanian. Web developer with practical experience in PHP backend scripts, MySQL database maintenance, and HTML/CSS web templates.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        Candidate(
            name="Neha Saxena",
            email="neha.saxena@example.com",
            phone="+91 98567 89012",
            education="MCA",
            experience=2.0,
            skills="React, Node.js, JavaScript, Express, MongoDB, Git",
            resume_text="Neha Saxena. Full stack MERN engineer with 2 years experience developing client applications with React and Express microservices.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        Candidate(
            name="Siddharth Rao",
            email="siddharth.rao@example.com",
            phone="+91 98678 90123",
            education="BTech Computer Science",
            experience=4.0,
            skills="Python, Machine Learning, Deep Learning, SQL, FastAPI, Docker, Kubernetes, AWS",
            resume_text="Siddharth Rao. Lead AI Engineer with 4 years deploying computer vision models, scalable inference endpoints on Kubernetes, and high-performance ML pipelines.",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        )
    ]

    for cand in sample_candidates:
        db.add(cand)
    db.commit()

    # Re-query jobs and candidates to get auto-generated IDs
    jobs = db.query(Job).all()
    candidates = db.query(Candidate).all()
    job_map = {j.title: j for j in jobs}
    cand_map = {c.email: c for c in candidates}

    print("[SEED] Screening and generating Applications...")
    # Define mapping of who applied to which job
    application_pairings = [
        # AI/ML Intern applicants (Matches user demo scenario)
        ("rahul.sharma@example.com", "AI/ML Intern", "Shortlisted"),
        ("sneha.patil@example.com", "AI/ML Intern", "Shortlisted"),
        ("priya.nair@example.com", "AI/ML Intern", "Screened"),
        ("kiran.verma@example.com", "AI/ML Intern", "Review"),
        ("arjun.mehta@example.com", "AI/ML Intern", "Rejected"),
        ("divya.menon@example.com", "AI/ML Intern", "Interview"),
        
        # Junior Python Developer applicants
        ("rahul.sharma@example.com", "Junior Python Developer", "Shortlisted"),
        ("ananya.iyer@example.com", "Junior Python Developer", "Interview"),
        ("siddharth.rao@example.com", "Junior Python Developer", "Interview"),
        ("priya.nair@example.com", "Junior Python Developer", "Review"),
        
        # Full Stack Web Developer applicants
        ("rohan.deshmukh@example.com", "Full Stack Web Developer", "Shortlisted"),
        ("neha.saxena@example.com", "Full Stack Web Developer", "Screened"),
        ("karthik.sub@example.com", "Full Stack Web Developer", "Review"),
        ("arjun.mehta@example.com", "Full Stack Web Developer", "Rejected"),
        
        # Data Engineer applicants
        ("vikas.gupta@example.com", "Data Engineer", "Shortlisted"),
        ("rahul.sharma@example.com", "Data Engineer", "Screened"),
        ("tanmay.bhatt@example.com", "Data Engineer", "Review"),
        
        # Cloud DevOps Engineer applicants
        ("pooja.kulkarni@example.com", "Cloud DevOps Engineer", "Shortlisted"),
        ("ananya.iyer@example.com", "Cloud DevOps Engineer", "Review"),
        
        # Frontend Developer applicants
        ("aditya.reddy@example.com", "Frontend Developer", "Shortlisted"),
        ("rohan.deshmukh@example.com", "Frontend Developer", "Screened"),
        ("kiran.verma@example.com", "Frontend Developer", "Rejected"),
        
        # QA Automation Engineer applicants
        ("meera.joshi@example.com", "QA Automation Engineer", "Shortlisted"),
        ("karthik.sub@example.com", "QA Automation Engineer", "Review"),
        
        # Data Analyst applicants
        ("tanmay.bhatt@example.com", "Data Analyst", "Shortlisted"),
        ("sneha.patil@example.com", "Data Analyst", "Screened"),
        ("arjun.mehta@example.com", "Data Analyst", "Rejected")
    ]

    for email, job_title, initial_status in application_pairings:
        cand = cand_map.get(email)
        job = job_map.get(job_title)
        if not cand or not job:
            continue

        result = engine.screen(
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

        # Status logic: if initial_status provided, honor it, otherwise infer from eligibility
        status = initial_status
        if result["eligibility"] == "Not Eligible" and status not in ["Rejected"]:
            status = "Rejected"

        recruiter_note = (
            "Screened via deterministic scoring matrix. Recommended for technical shortlisting."
            if result["eligibility"] == "Eligible"
            else (
                f"Requires manual review: {result['reason']}"
                if result["eligibility"] == "Review"
                else "Disqualified during baseline eligibility check."
            )
        )

        app = Application(
            candidate_id=cand.candidate_id,
            job_id=job.job_id,
            fit_score=result["fit_score"],
            skills_score=result["skills_score"],
            experience_score=result["experience_score"],
            education_score=result["education_score"],
            preferred_skills_score=result["preferred_skills_score"],
            keyword_score=result["keyword_score"],
            eligibility=result["eligibility"],
            status=status,
            missing_skills=", ".join(result["missing_skills"]),
            reason=result["reason"],
            recruiter_notes=recruiter_note,
            override_reason="",
            applied_at=datetime.datetime.utcnow() - datetime.timedelta(hours=hash(email + job_title) % 120)
        )
        db.add(app)

    db.commit()
    print("[SEED] Successfully seeded database with realistic jobs, candidates, and applications!")

if __name__ == "__main__":
    from database import SessionLocal, Base, engine
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db, force_reset=True)
    db.close()
