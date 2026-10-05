"""
Interactive SQLite Database Inspector for HR Recruitment System.
Run: python view_db.py
"""

import sqlite3
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database", "recruitment.db")

if not os.path.exists(DB_PATH):
    print(f"Error: Database file not found at {DB_PATH}")
    sys.exit(1)

def print_table(title, headers, rows):
    print("\n" + "=" * 80)
    print(f" TABLE: {title.upper()} ({len(rows)} records)")
    print("=" * 80)
    if not rows:
        print("  (Empty table)")
        return

    # Calculate column widths
    col_widths = [len(h) for h in headers]
    for row in rows:
        for idx, val in enumerate(row):
            val_str = str(val) if val is not None else "NULL"
            if len(val_str) > 35:
                val_str = val_str[:32] + "..."
            if len(val_str) > col_widths[idx]:
                col_widths[idx] = min(len(val_str), 35)

    header_line = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
    sep_line = "-+-".join("-" * col_widths[i] for i in range(len(headers)))
    print(header_line)
    print(sep_line)

    for row in rows:
        formatted_row = []
        for i, val in enumerate(row):
            val_str = str(val) if val is not None else "NULL"
            if len(val_str) > 35:
                val_str = val_str[:32] + "..."
            formatted_row.append(val_str.ljust(col_widths[i]))
        print(" | ".join(formatted_row))

def inspect_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print(f"\nConnected to SQLite Database: {DB_PATH}")

    # 1. Summary of Tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    tables = [t[0] for t in cursor.fetchall()]
    print(f"Found Tables: {', '.join(tables)}")

    # 2. JOBS Table
    cursor.execute("SELECT job_id, title, department, minimum_experience, education_requirement, status FROM jobs;")
    jobs = cursor.fetchall()
    print_table("JOBS", ["ID", "Title", "Department", "Min Exp", "Edu Req", "Status"], jobs)

    # 3. CANDIDATES Table (First 10)
    cursor.execute("SELECT candidate_id, name, email, education, experience, skills FROM candidates LIMIT 10;")
    cands = cursor.fetchall()
    print_table("CANDIDATES (Sample 10)", ["ID", "Name", "Email", "Education", "Exp", "Skills"], cands)

    # 4. APPLICATIONS Table with Ranks & Scores
    cursor.execute("""
        SELECT a.application_id, c.name, j.title, a.fit_score, a.eligibility, a.status, a.missing_skills
        FROM applications a
        JOIN candidates c ON a.candidate_id = c.candidate_id
        JOIN jobs j ON a.job_id = j.job_id
        ORDER BY a.fit_score DESC
        LIMIT 10;
    """)
    apps = cursor.fetchall()
    print_table("TOP APPLICATIONS (Ranked by Fit Score)", ["App ID", "Candidate", "Job Title", "Fit Score", "Eligibility", "Status", "Missing Skills"], apps)

    # 5. SQL Aggregation Query (DBMS Project Requirement)
    print("\n" + "=" * 80)
    print(" SQL AGGREGATION: APPLICANTS & AVERAGE FIT SCORE PER JOB")
    print("=" * 80)
    cursor.execute("""
        SELECT j.title, COUNT(a.application_id) as total_applicants, ROUND(AVG(a.fit_score), 1) as avg_fit_score
        FROM jobs j
        LEFT JOIN applications a ON j.job_id = a.job_id
        GROUP BY j.job_id
        ORDER BY total_applicants DESC;
    """)
    stats = cursor.fetchall()
    print_table("JOB APPLICANT STATISTICS", ["Job Title", "Total Applicants", "Average Fit Score (%)"], stats)

    conn.close()

if __name__ == "__main__":
    inspect_database()
