# HR Recruitment & Candidate Screening System (TalentPulse AI)

A complete, interactive, presentation-ready web application prototype built for a college team project / viva evaluation. The system automates resume ingestion, checks eligibility using deterministic rules, calculates explainable job-fit scores, priority-ranks candidates, and provides recruiters with ethical, transparent decision-support.

---

## 1. Project Objective & Problem Statement

Human Resource (HR) departments manually evaluate hundreds of resumes per job opening. This manual process causes:
- Fatigue, human bias, and severe pipeline bottlenecks.
- Subjective inconsistencies between different screeners.
- Qualified applicants being missed due to overlooked resume sections.

**TalentPulse AI** provides an explainable decision-support system that:
1. Ingests candidate resumes (PDF or TXT) or structured input.
2. Applies deterministic eligibility rules (minimum education, minimum experience, mandatory skills).
3. Calculates a normalized job-fit score (0–100%) using configurable weights (Skills 50%, Experience 30%, Education 20%).
4. Ranks candidates from highest to lowest fit score.
5. Provides a full explanation of every score, highlighting matched and missing skills.
6. Safeguards candidates by strictly excluding demographic data (gender, religion, caste, age, disability, photos) and allowing recruiters to override recommendations with a recorded reason.

---

## 2. Technology Stack & Architecture

```
+-----------------------------------------------------------------------------------+
|                            PRESENTATION LAYER (Frontend)                          |
|  React 18 + Vite | Tailwind CSS | Lucide React Icons | Recharts Visualizations    |
|  Dual-Mode Resilience: Online (FastAPI) + Offline (LocalStorage Fallback)         |
+-----------------------------------------------------------------------------------+
                                          |
                                   REST APIs (JSON)
                                          |
+-----------------------------------------------------------------------------------+
|                             BACKEND API LAYER (FastAPI)                           |
|  FastAPI (Python 3.10+) | Uvicorn | Pydantic V2 Models | CORS Middleware          |
+-----------------------------------------------------------------------------------+
             |                                                |
+-------------------------------------+      +--------------------------------------+
|       ALGORITHMIC SCREENING ENGINE  |      |      B-TREE INDEXING ENGINE          |
|  • DMGT Set Theory for Skills       |      |  • Academic Order m=3 Balanced Tree  |
|  • ADSA Weighted Linear Combination |      |  • O(log_m N) vs O(N) Benchmark      |
|  • Deterministic Eligibility Logic  |      |  • Live Visualizer & Step Tracer     |
+-------------------------------------+      +--------------------------------------+
                                          |
+-----------------------------------------------------------------------------------+
|                             DATABASE LAYER (SQLite 3)                             |
|  SQLAlchemy ORM | Foreign Keys with Cascades | 3NF Schema Design                  |
|  Tables: jobs, candidates, applications, screening_results, recruiter_notes       |
+-----------------------------------------------------------------------------------+
```

- **Frontend:** React with Vite, JavaScript (JSX), Tailwind CSS, Lucide React icons, Recharts.
- **Backend:** Python with FastAPI, Uvicorn, SQLAlchemy ORM.
- **Database:** SQLite 3 with composite indexing.
- **B-Tree Demonstration:** Custom Python B-Tree (Order $m=3$) written by our team to demonstrate $O(\log_m N)$ logarithmic search versus $O(N)$ linear scans in the UI. *(Academic disclaimer: SQLite's internal storage engine uses a separate, native C-implemented B-tree).*
- **Dual-Mode Offline Resilience:** If the Python FastAPI backend is not running, the frontend automatically falls back to an in-browser local storage mock with pre-seeded data, ensuring zero downtime during college evaluations.

---

## 3. Database Design (3NF Relational Model)

The database schema is organized in Third Normal Form (3NF) across 4 core tables:

1. **`jobs` Table:**
   - `job_id` (INTEGER, Primary Key, Auto-increment)
   - `title` (VARCHAR 150) — *e.g., Junior Python Developer, Frontend Developer, Data Analyst*
   - `department` (VARCHAR 100)
   - `description` (TEXT)
   - `required_skills` (TEXT) — Comma-separated mandatory skills
   - `preferred_skills` (TEXT) — Comma-separated secondary skills
   - `minimum_experience` (FLOAT) — Minimum years required
   - `education_requirement` (VARCHAR 150) — Degree threshold
   - `skill_weight` (FLOAT, Default 0.50) — Configurable weight (0.0 to 1.0)
   - `experience_weight` (FLOAT, Default 0.30) — Configurable weight (0.0 to 1.0)
   - `education_weight` (FLOAT, Default 0.20) — Configurable weight (0.0 to 1.0)
   - `status` (VARCHAR 50) — 'Active', 'Draft', 'Closed'
   - `created_at` (DATETIME)

2. **`candidates` Table:**
   - `candidate_id` (INTEGER, Primary Key, Auto-increment)
   - `name` (VARCHAR 150)
   - `email` (VARCHAR 150, Unique, Indexed)
   - `phone` (VARCHAR 50)
   - `education` (VARCHAR 150)
   - `experience` (FLOAT)
   - `skills` (TEXT)
   - `resume_text` (TEXT)
   - `created_at` (DATETIME)

3. **`applications` Table:**
   - `application_id` (INTEGER, Primary Key, Auto-increment)
   - `candidate_id` (INTEGER, Foreign Key -> `candidates.candidate_id` ON DELETE CASCADE)
   - `job_id` (INTEGER, Foreign Key -> `jobs.job_id` ON DELETE CASCADE)
   - `fit_score` (FLOAT, Indexed) — Overall score (0.0–100.0)
   - `skills_score` (FLOAT) — Skill match percentage
   - `experience_score` (FLOAT) — Experience score percentage
   - `education_score` (FLOAT) — Education score percentage
   - `preferred_skills_score` (FLOAT)
   - `keyword_score` (FLOAT)
   - `eligibility` (VARCHAR 50) — 'Eligible', 'Review', 'Not Eligible'
   - `status` (VARCHAR 50) — 'Screened', 'Shortlisted', 'Rejected', 'Interview'
   - `missing_skills` (TEXT) — JSON or comma-separated missing mandatory skills
   - `reason` (TEXT) — Plain-English explanation of decision
   - `recruiter_notes` (TEXT) — Persistent recruiter notes
   - `override_reason` (TEXT) — Recorded justification for manual overrides
   - `applied_at` (DATETIME)

---

## 4. 5-Step Deterministic Screening Workflow

Our screening workflow follows 5 transparent mathematical steps:

```
[Resume / Profile] 
       │
       ▼
[Step 1: Apply Configurable Rules] ──► Checks min education, min experience & mandatory skills
       │
       ▼
[Step 2: Assign Eligibility Status] ──► Classified as: "Eligible", "Needs Review", or "Not Eligible"
       │
       ▼
[Step 3: Calculate Job-Fit Score] ──► Fit Score = (W_skill × SkillScore) + (W_exp × ExpScore) + (W_edu × EduScore)
       │                              Default weights: 50% Skills, 30% Experience, 20% Education (Normalized)
       ▼
[Step 4: Rank Eligible Candidates] ──► Priority sort applicants from highest to lowest fit score
       │
       ▼
[Step 5: Explain Decision & Audit] ──► Display matched skills, missing skills, breakdown & recruiter override
```

### Ethical Screening Safeguards:
- **Zero Demographic Bias:** Protected personal attributes (gender, age, religion, caste, marital status, disability, photographs) are strictly excluded from parsing and ranking algorithms.
- **Decision-Support Estimates:** Scores are explicitly presented as decision-support aids—never as objective measures of human worth.
- **Human-in-the-Loop Override:** Recruiters can manually change any automated status (Shortlist, Needs Review, Not Selected) and record an audit justification in the database.

---

## 5. Main Application Pages

1. **Dashboard:**
   - 5 Top KPI Cards: Total Candidates, Eligible Candidates, Candidates Shortlisted, **Needs Manual Review**, and Average Job-Fit Score.
   - **Candidate Pipeline Funnel Chart** (built with Recharts).
   - **Candidate Skills Distribution Chart** (built with Recharts).
   - Quick actions to "Add Candidate" and "Run Screening".
   - Recent candidate activity stream with live status badges.

2. **Job Openings:**
   - View, create, and edit technical job openings.
   - Sample jobs pre-seeded: **Junior Python Developer**, **Frontend Developer**, **Data Analyst**, **AI/ML Intern**, etc.
   - Configure required skills, preferred skills, minimum education, minimum experience, and 50/30/20% scoring weights with auto-normalization.

3. **Candidate Management:**
   - Searchable, filterable candidate table with:
     - Candidate ID (`#CAND-001`)
     - Name and contact email/phone
     - Applied job opening
     - Skills chips
     - Education & experience
     - AI Fit Score & Eligibility status
     - Application status (Shortlisted, Needs Review, Rejected, Interview)
   - Pagination controls (with selectable page size: 5, 8, 15, 25).
   - Modal actions for **Add Candidate**, **Edit Candidate**, and **Delete Candidate** (with confirmation).

4. **Interactive Smart Screening:**
   - 5-step visual workflow indicator.
   - Upload PDF/TXT resumes or select 1-click sample candidates (Strong Match, Review Needed, Not Eligible).
   - Real-time scoring breakdown, matched technical skills, missing mandatory skills, and explainable rationale.
   - Recruiter decision buttons (Shortlist, Needs Review, Not Selected) with recorded notes and manual override reason.

5. **Candidate Details Profile Modal:**
   - Full contact details, education, and experience.
   - Gauge fit score indicator and sub-component breakdown.
   - Recruitment audit timeline.
   - Persistent recruiter notes and manual decision override dialog.

6. **Technical Insights (Viva Demonstration Page):**
   - **Full Architecture Diagram:** React (Vite) $\to$ REST API (FastAPI) $\to$ SQLite (SQLAlchemy) + Python Screening.
   - **Interactive B-Tree Index Demonstrator:** Live search on an Order $m=3$ B-Tree comparing $O(\log_m N)$ tree lookups against $O(N)$ linear scans, showing traversal paths and tree node keys.
   - **DBMS 3NF Schema & ER Model:** Interactive ER visualizer showing primary/foreign key relationships.
   - **Live SQL Query Playground:** Pre-built SQL queries (eligible candidates, average scores by job, missing skills filter) with a live query executor.
   - **Screening Rules & OOP Concepts:** Explanation of classes, set theory intersections, and mathematical formulas for college faculty evaluation.

---

## 6. Installation & Setup Instructions

### Prerequisites
- Python 3.10 or higher
- Node.js (v18+) and npm

### Method 1: Automatic One-Click Launch (Windows)
Double-click the batch file in the project root:
```cmd
start_full_app.bat
```
This starts both the FastAPI backend on port 8000 and the React Vite dev server on port 5173.

---

### Method 2: Manual Step-by-Step Startup

#### Step 1: Start the FastAPI Backend
Open a terminal in the project directory:
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies (if not already installed)
pip install fastapi uvicorn sqlalchemy pydantic pypdf python-multipart

# Seed demo database (8 job openings, 16 candidate applications)
python seed_data.py

# Launch FastAPI development server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000`
- **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`

#### Step 2: Start the React Frontend
Open a second terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
- **Frontend URL:** `http://localhost:5173`

---

## 7. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Aggregated dashboard KPI counts, pipeline chart, and top skills |
| `GET` | `/jobs` | Get all job openings with applicant counts and average scores |
| `POST` | `/jobs` | Create a new job opening with configurable weights |
| `GET` | `/jobs/{id}` | Get details of a specific job |
| `PUT` | `/jobs/{id}` | Update job description, requirements, or weights |
| `DELETE` | `/jobs/{id}` | Delete job opening and associated applications |
| `GET` | `/candidates` | Search and filter candidates |
| `POST` | `/candidates` | Add a new candidate record |
| `GET` | `/candidates/{id}` | Get candidate profile, scores, and application history |
| `PUT` | `/candidates/{id}` | Update candidate information |
| `DELETE` | `/candidates/{id}` | Delete a candidate from the database |
| `POST` | `/upload-resume` | Upload PDF/TXT resume and parse extracted text |
| `POST` | `/screen-candidate` | Execute deterministic screening and save application |
| `GET` | `/applications` | Filter, search, and sort candidate applications |
| `POST` | `/applications/{id}/status` | Update status, recruiter notes, and manual override reason |
| `POST` | `/applications/{id}/notes` | Update recruiter notes on an application |
| `GET` | `/api/btree/index` | Retrieve current academic B-Tree index structure |
| `POST` | `/api/btree/search` | Search candidate ID in B-Tree with traversal trace |
| `GET` | `/api/skills/distribution` | Technical skill distribution across applicants |
| `POST` | `/demo/run-screening` | Run default demo screening scenario |
| `POST` | `/demo/reset` | Reset database to clean 8 jobs and 16 candidates |

---

## 8. College Presentation & Viva Walkthrough Steps

Follow these steps for a live demonstration to a professor or evaluation panel:

1. **Dashboard Telemetry:**
   - Open `http://localhost:5173`.
   - Point out the 5 KPI cards: Total Candidates (16), Eligible (10), Shortlisted (6), **Needs Manual Review (4)**, and Average Fit Score (~74.8%).
   - Highlight the **Recharts Candidate Pipeline Funnel** and **Skills Distribution** charts.
   - Show the quick action buttons: "Add Candidate" and "Run Screening".

2. **Job Openings Management:**
   - Navigate to the **Job Openings** tab.
   - Show the pre-seeded openings: **Junior Python Developer**, **Frontend Developer**, **Data Analyst**, and **AI/ML Intern**.
   - Click "Create Job Opening" or edit an existing job to showcase configurable 50/30/20% scoring weights and required/preferred skills.

3. **Candidate Management & CRUD Operations:**
   - Navigate to the **Candidates & Ranking** tab.
   - Demonstrate the search bar (filter by "Python", "React", or "SQL").
   - Filter by Minimum Score ($\ge 75\%$) to isolate top performers.
   - Demonstrate **Pagination** (switch page sizes between 5, 8, 15).
   - Click **"Add Candidate"** to show the validated form.
   - Click **"Edit"** on a candidate to modify details.
   - Show candidate deletion with confirmation.

4. **Deterministic Smart Screening Walkthrough:**
   - Navigate to the **Resume Screener** tab.
   - Review the 5-step screening diagram and ethical AI compliance banner.
   - Select the **"AI/ML Intern"** opening.
   - Click **"Sample 1: Strong Match (Rahul)"** $\to$ Click "Run Screening".
     - Notice: Fit score **~92%**, Status: **Eligible**, Matched skills highlighted in green, Recommended Action: **SHORTLIST**.
   - Click **"Sample 3: Not Eligible (Arjun)"** $\to$ Click "Run Screening".
     - Notice: Fit score **~32%**, Status: **Not Eligible**, Missing mandatory skills flagged in red (`Python`, `Machine Learning`, `SQL`).
   - Enter recruiter notes and test the **Manual Override** action.

5. **Technical Insights & Academic Viva Defense:**
   - Navigate to the **Technical Insights** tab.
   - **Architecture Diagram:** Explain the flow from React to FastAPI, SQLite, and the Python scoring engine.
   - **Interactive B-Tree Demonstrator:** Select a candidate ID (e.g., ID 5) and click "Execute B-Tree Search". Show how the tree descends through internal nodes to leaf nodes in $O(\log_m N)$ time compared to an $O(N)$ linear scan. Note the academic disclaimer regarding SQLite's separate internal C B-tree.
   - **Live SQL Playground:** Run sample SQL queries to demonstrate real database joins and filtering.
   - **Mathematical Formulas:** Explain the ADSA weighted scoring formula and DMGT set intersection rules.

---

## 9. Current Limitations & Future Roadmap

- **Optical Character Recognition (OCR):** Resumes submitted as scanned images (PNG/JPG) are not currently OCR-processed; only text-based PDFs and TXT files are parsed directly.
- **Natural Language Parsing Scope:** Skill matching uses normalized vocabulary matching and token sets; integration of transformer-based embeddings (e.g., BERT/Sentence-Transformers) could capture non-standard synonyms.
- **Email Notifications:** The prototype records interview scheduling in the database; automated SMTP email dispatch to candidates can be integrated in a production deployment.
