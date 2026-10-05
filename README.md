# AI-Powered HR Recruitment & Candidate Screening System

A modern, full-stack Applicant Tracking System (ATS) and candidate screening prototype built for academic demonstration and technical recruitment operations. The system automates resume parsing, candidate scoring, qualification ranking, and recruiter shortlisting using mathematical decision rules and algorithmic ranking.

---

## 1. Project Overview

Manual resume screening for technical job openings is time-consuming, prone to human fatigue, and inconsistent across candidates. **TalentPulse AI** provides HR teams with an automated pipeline to ingest candidate resumes (PDF or TXT), parse skills and qualifications, compute an objective **AI Fit Score (0–100%)**, evaluate eligibility, highlight missing competencies, and prioritize candidates for interview shortlisting.

---

## 2. Problem Statement

An HR department faces hundreds of resumes per job opening. Reading every resume manually causes:
- Recruitment delays and pipeline bottlenecks.
- Subjective filtering variations among different screeners.
- Qualified applicants being missed due to overlooked resume sections.

**Solution:** An automated screening engine that ingests job descriptions, computes weighted multi-criteria compatibility scores, enforces categorical eligibility thresholds, and presents candidates in an interactive dashboard.

---

## 3. Key Features

- **Recruiter KPI Dashboard:**
  - Real-time statistics: Total Jobs, Total Candidates, Eligible Applicants, Shortlisted Counts, and Average Fit Score.
  - Interactive distribution charts and popular job openings.
- **Job Management:**
  - Create, view, update, and delete technical job openings.
  - Specify required skills (50% weight), preferred skills (10%), minimum experience, and degree requirements.
- **Candidate Pool & AI Ranking:**
  - Dynamically sorted candidate table with ranks (`#1`, `#2`, `#3`...).
  - Multi-criteria filtering by Job, Minimum Fit Score, Eligibility tier, Experience, and Application Status.
  - One-click recruiter actions: **Shortlist**, **Reject**, and **Schedule Interview**.
- **Candidate Profile & Explainability:**
  - Visual circular/gauge score indicator (`86 / 100`).
  - Breakdown bars: Skills (50%), Experience (20%), Education (15%), Preferred (10%), Keywords (5%).
  - Highlighted **Missing Required Skills** tags (e.g., `✕ FastAPI`).
  - Plain-English screening rationale explaining why an applicant was accepted or rejected.
- **Interactive Resume Screener:**
  - Upload PDF resumes (via PyPDF) or plain TXT files.
  - Heuristic entity extraction for candidate name, email, phone, education, experience, and verified technical skills.
  - Instant scoring against any selected job opening with 1-click database synchronization.
- **Recruitment Analytics:**
  - Score distribution histogram, eligibility ratios, applicant volume per opening, and status funnel conversion rates.
- **Interactive Demo Mode:**
  - One-click "Run Demo Screening" button executing the default **AI/ML Intern** scenario across 5 benchmark profiles.
  - One-click database reset and sample data seeder.

---

## 4. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons |
| **Backend** | Python 3.13, FastAPI, Uvicorn, Pydantic |
| **Database** | SQLite, SQLAlchemy ORM |
| **Document Processing** | PyPDF, Regular Expressions (Regex), NLP Normalization |
| **Architecture** | REST API Architecture with JSON Serialization |

---

## 5. College Curriculum & Theoretical Foundations

This prototype directly illustrates six fundamental computer science domains:

### 1. DBMS (Database Management Systems)
- **Relational ER Model:** Three primary entities: `JOBS`, `CANDIDATES`, and `APPLICATIONS`.
- **Relational Integrity:** Implemented with foreign keys (`candidate_id`, `job_id`) and cascading deletes (`ondelete="CASCADE"`).
- **SQLite Persistence:** Zero-configuration relational database engine adhering to ACID guarantees.

### 2. SQL (Structured Query Language)
- **Aggregation Queries:** `func.avg(Application.fit_score)`, `func.count(Application.application_id)`, and `func.coalesce()` to calculate applicant counts and mean fit scores per job.
- **Multi-Table Joins:** `JOIN Application ON Candidate` and `JOIN Application ON Job` to merge candidate profiles, scores, and job metadata in a single indexed query.
- **Filtering & Predicates:** Pattern matching (`ilike`), threshold ranges (`fit_score >= min_score`), and conditional status filters.

### 3. DMGT (Discrete Mathematics & Graph Theory)
- **Set Theory:**
  - $\text{Matched Skills} = \text{Candidate Skills} \cap \text{Required Skills}$
  - $\text{Missing Skills} = \text{Required Skills} \setminus \text{Candidate Skills}$
- **Degree Lattice:** Poset (Partially Ordered Set) hierarchy for evaluating educational degrees (PhD > MTech/MCA > BTech/BE > Diploma).
- **Boolean Decision Rules:** Predicate logic evaluating eligibility:
  $$\text{Eligible} \iff (\text{Fit Score} \ge 75) \land (\text{Skills Score} \ge 50)$$
  $$\text{Review} \iff 50 \le \text{Fit Score} < 75$$
  $$\text{Not Eligible} \iff \text{Fit Score} < 50$$

### 4. ADSA (Advanced Data Structures & Algorithms)
- **Composite B-Tree Indexes:** Database indexes on `(job_id, fit_score DESC)` for high-throughput rank querying.
- **Priority Ranking:** Sorting and rank numbering $O(N \log N)$ to prioritize top applicants.
- **Weighted Multi-Attribute Scoring:** Linear combination algorithm normalizing sub-scores into an objective 0–100 index.

### 5. OOP (Object-Oriented Programming)
- Modular encapsulation across classes:
  - `Job`: Data model for opening specifications.
  - `Candidate`: Data model for applicant records.
  - `Application`: Association entity linking candidates and jobs.
  - `ScreeningEngine`: Encapsulated scoring logic, sub-score calculators, and decision rules.
  - `ResumeParser`: Text extraction and heuristic entity detection.

### 6. Python
- Modern async FastAPI web server, Pydantic type validation, and robust regex-based NLP normalization.

---

## 6. Database Schema Design

### `JOBS` Table
- `job_id` (INTEGER, Primary Key, Auto-increment)
- `title` (VARCHAR 150)
- `department` (VARCHAR 100)
- `description` (TEXT)
- `required_skills` (TEXT)
- `preferred_skills` (TEXT)
- `minimum_experience` (FLOAT)
- `education_requirement` (VARCHAR 150)
- `status` (VARCHAR 50) — 'Active', 'Draft', 'Closed'
- `created_at` (DATETIME)

### `CANDIDATES` Table
- `candidate_id` (INTEGER, Primary Key, Auto-increment)
- `name` (VARCHAR 150)
- `email` (VARCHAR 150, Unique, Indexed)
- `phone` (VARCHAR 50)
- `education` (VARCHAR 150)
- `experience` (FLOAT)
- `skills` (TEXT)
- `resume_text` (TEXT)
- `created_at` (DATETIME)

### `APPLICATIONS` Table
- `application_id` (INTEGER, Primary Key, Auto-increment)
- `candidate_id` (INTEGER, Foreign Key -> `candidates.candidate_id`)
- `job_id` (INTEGER, Foreign Key -> `jobs.job_id`)
- `fit_score` (FLOAT, Indexed)
- `skills_score` (FLOAT)
- `experience_score` (FLOAT)
- `education_score` (FLOAT)
- `preferred_skills_score` (FLOAT)
- `keyword_score` (FLOAT)
- `eligibility` (VARCHAR 50) — 'Eligible', 'Review', 'Not Eligible'
- `status` (VARCHAR 50) — 'Screened', 'Shortlisted', 'Rejected', 'Interview'
- `missing_skills` (TEXT)
- `reason` (TEXT)
- `applied_at` (DATETIME)

---

## 7. How Candidate Scoring Works

The `ScreeningEngine` computes a composite **AI Fit Score** between `0.0` and `100.0` based on 5 weighted pillars:

$$\text{Fit Score} = 0.50 \cdot S_{\text{skills}} + 0.20 \cdot S_{\text{exp}} + 0.15 \cdot S_{\text{edu}} + 0.10 \cdot S_{\text{pref}} + 0.05 \cdot S_{\text{kw}}$$

1. **Skills Match ($50\%$ Weight):**
   - Compares candidate's skills against mandatory job skills using set intersection.
   - Calculates percentage: $(|C \cap R| / |R|) \times 100$.
2. **Experience Alignment ($20\%$ Weight):**
   - Compares candidate years against job requirement ratio.
   - If requirement is $0$ years, any applicant receives $100\%$.
3. **Education Compatibility ($15\%$ Weight):**
   - Matches candidate degree level against the requirement lattice (PhD > Master/MCA > Bachelor/BTech).
4. **Preferred Skills ($10\%$ Weight):**
   - Bonus points for secondary skills (e.g., Git, Pandas, Docker).
5. **Resume Keyword Relevance ($5\%$ Weight):**
   - Lexical frequency check of job description terms and domain keywords in resume text.

---

## 8. Installation & Setup

### Prerequisites
- Python 3.10+ installed
- Node.js installed

### Quick Start (One-Click)
Run the launcher batch file in the project root:
```bash
start_full_app.bat
```
This automatically launches both the FastAPI backend (`http://localhost:8000`) and the React Vite frontend (`http://localhost:5173`).

---

### Running Manually

#### Step 1: Start Backend
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- API will be accessible at: `http://127.0.0.1:8000`
- Interactive Swagger API docs: `http://127.0.0.1:8000/docs`

#### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```
- Frontend will open at: `http://localhost:5173`

---

## 9. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/jobs` | Get all job openings with applicant count & average fit score |
| `POST` | `/jobs` | Create a new job opening |
| `GET` | `/jobs/{id}` | Get specific job opening details |
| `PUT` | `/jobs/{id}` | Update job specifications |
| `DELETE` | `/jobs/{id}` | Delete job opening |
| `GET` | `/candidates` | Search and filter candidates by skill, experience, or query |
| `POST` | `/candidates` | Add a candidate manually |
| `GET` | `/candidates/{id}` | Retrieve candidate profile and application history |
| `POST` | `/upload-resume` | Upload PDF/TXT resume and extract entities |
| `POST` | `/screen-candidate` | Screen a candidate against a job and compute fit score |
| `GET` | `/applications` | Get ranked applications with sorting & filtering |
| `POST` | `/applications/{id}/shortlist` | Mark application as Shortlisted |
| `POST` | `/applications/{id}/reject` | Mark application as Rejected |
| `POST` | `/applications/{id}/interview` | Schedule interview for application |
| `GET` | `/analytics` | Retrieve KPI telemetry and chart distributions |
| `POST` | `/demo/run-screening` | Execute default demo screening scenario |
| `POST` | `/demo/reset` | Reset and re-seed database with clean sample records |

---

## 10. Demo Walkthrough (College Presentation Guide)

1. **Dashboard Overview:**
   - Show the 5 KPI cards at the top (Total Jobs: 8+, Candidates: 16+, Eligible, Shortlisted, Avg Match).
   - Point out the **Featured Demonstration Scenario** banner.
2. **Execute Demo Screening:**
   - Click the **"Run Demo Screening"** button in the sidebar or header.
   - The interactive modal will pop up displaying the evaluated candidates for the **"AI/ML Intern"** opening:
     - **Candidate A (Rahul Sharma):** Python, ML, SQL, Pandas, Git $\to$ **~92%** (**Eligible - Shortlist**)
     - **Candidate E (Sneha Patil):** Python, ML, SQL, NumPy $\to$ **~88%** (**Eligible - Shortlist**)
     - **Candidate B (Priya Nair):** Python, SQL $\to$ **~76%** (**Eligible**)
     - **Candidate C (Kiran Verma):** Python, JavaScript $\to$ **~58%** (**Review**)
     - **Candidate D (Arjun Mehta):** Java, HTML, CSS $\to$ **~32%** (**Not Eligible - Rejected**)
3. **Candidate Pool & Dynamic Ranking:**
   - Switch to the **Candidates** tab.
   - Demonstrate sorting by Fit Score, Experience, and Application Date.
   - Demonstrate filtering by Minimum Fit Score (e.g., $\ge 75\%$) and Eligibility (Eligible only).
4. **Candidate Profile Inspection:**
   - Click **"View"** on Rahul Sharma or Sneha Patil.
   - Showcase the circular **AI Fit Score indicator**, the individual score breakdown bars, and the explainable rationale.
   - Click **"Shortlist Candidate"** or **"Schedule Interview"** to observe instant status transition.
5. **Interactive Resume Screening:**
   - Switch to the **Resume Screener** tab.
   - Click one of the quick sample buttons (e.g. *Sample C: Low Match (Arjun)*).
   - Click **"Analyze & Screen Candidate"**.
   - Watch the engine immediately calculate a low score (~32%), classify as **Not Eligible**, and flag the missing mandatory skills (`Python`, `Machine Learning`, `SQL`).
6. **Analytics & Metrics:**
   - Switch to **Analytics** to view the Fit Score distribution histogram, eligibility donut chart, and applicant counts.
