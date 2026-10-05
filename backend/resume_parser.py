import io
import re
from typing import Dict, Any, List

# Common tech skills lexicon for automatic resume skill discovery
KNOWN_SKILLS = [
    "python", "machine learning", "deep learning", "artificial intelligence", "nlp", "computer vision",
    "sql", "postgresql", "mysql", "sqlite", "mongodb", "redis",
    "fastapi", "flask", "django", "rest api", "graphql",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "matplotlib", "seaborn",
    "react", "react.js", "next.js", "javascript", "typescript", "html", "css", "tailwind", "vue", "angular",
    "node.js", "express", "java", "spring boot", "c++", "c#", ".net", "golang", "rust",
    "git", "github", "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "linux", "bash",
    "agile", "scrum", "jira", "tableau", "power bi", "excel", "data analysis", "spark", "hadoop"
]

EDUCATION_PATTERNS = [
    (r"\b(ph\.?d|doctorate)\b", "PhD in Computer Science / Engineering"),
    (r"\b(m\.?tech|m\.?e|ms in cs|master of technology|master of engineering)\b", "MTech Computer Science"),
    (r"\b(mca|master of computer applications)\b", "MCA"),
    (r"\b(mba)\b", "MBA"),
    (r"\b(b\.?tech|b\.?e|bachelor of technology|bachelor of engineering)\b", "BTech Computer Science"),
    (r"\b(bca|bachelor of computer applications)\b", "BCA"),
    (r"\b(b\.?sc|bachelor of science)\b", "BSc Computer Science"),
    (r"\b(diploma)\b", "Diploma in Engineering"),
    (r"\b(graduate|bachelor)\b", "Bachelor's Degree")
]

class ResumeParser:
    """
    Parser for PDF and TXT resumes using NLP/regular expressions.
    Extracts Candidate Name, Email, Phone, Experience, Education, and Skills.
    """

    @classmethod
    def extract_text_from_pdf(cls, file_bytes: bytes) -> str:
        """Extract plain text from PDF bytes using pypdf."""
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for page in reader.pages:
                txt = page.extract_text()
                if txt:
                    text_parts.append(txt)
            return "\n".join(text_parts)
        except Exception as e:
            # Fallback for plain text or decode error
            try:
                return file_bytes.decode("utf-8", errors="ignore")
            except Exception:
                return ""

    @classmethod
    def extract_email(cls, text: str) -> str:
        match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b', text)
        return match.group(0) if match else ""

    @classmethod
    def extract_phone(cls, text: str) -> str:
        # Matches patterns like +91 9876543210, (123) 456-7890, 98765-43210, etc.
        match = re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        return match.group(0).strip() if match else ""

    @classmethod
    def extract_education(cls, text: str) -> str:
        text_lower = text.lower()
        for pattern, label in EDUCATION_PATTERNS:
            if re.search(pattern, text_lower):
                return label
        return "BTech / Any Graduate"

    @classmethod
    def extract_experience(cls, text: str) -> float:
        text_lower = text.lower()
        
        # Matches expressions like "3 years of experience", "2.5 yrs exp", "4+ years"
        exp_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s+of\s+experience|\s+exp)?', text_lower)
        if exp_match:
            try:
                return float(exp_match.group(1))
            except ValueError:
                pass

        # Check for fresher keywords
        if any(w in text_lower for w in ["fresher", "fresh graduate", "entry level", "internship only", "0 years"]):
            return 0.0

        return 1.0  # Conservative default

    @classmethod
    def extract_skills(cls, text: str) -> List[str]:
        text_lower = text.lower()
        found_skills = set()
        
        for skill in KNOWN_SKILLS:
            # Match whole phrase or word boundary
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                # Standardize capitalization
                display_name = skill.title()
                if skill in ["sql", "html", "css", "nlp", "ai", "ml", "aws", "gcp", "ci/cd"]:
                    display_name = skill.upper()
                elif skill in ["fastapi", "react.js", "next.js", "node.js"]:
                    display_name = skill.replace(".js", "").title()
                found_skills.add(display_name)
                
        return sorted(list(found_skills))

    @classmethod
    def extract_name(cls, text: str, email: str = "") -> str:
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        if not lines:
            if email:
                name_part = email.split('@')[0].replace('.', ' ').replace('_', ' ')
                return name_part.title()
            return "Candidate"

        # Usually the candidate's name is on line 1 or 2
        for line in lines[:3]:
            # Filter out headers like "Resume", "Curriculum Vitae", emails, phone numbers
            if any(h in line.lower() for h in ["resume", "curriculum", "vitae", "profile", "contact", "@", "phone", "http"]):
                continue
            words = line.split()
            if 1 <= len(words) <= 4 and re.match(r'^[A-Za-z\s\.]+$', line):
                return line.title()

        if email:
            name_part = email.split('@')[0].replace('.', ' ').replace('_', ' ')
            return name_part.title()

        return "New Candidate"

    @classmethod
    def parse_resume(cls, text: str) -> Dict[str, Any]:
        """Runs complete heuristic extraction on resume text."""
        email = cls.extract_email(text)
        name = cls.extract_name(text, email)
        phone = cls.extract_phone(text)
        education = cls.extract_education(text)
        experience = cls.extract_experience(text)
        skills = cls.extract_skills(text)

        return {
            "name": name,
            "email": email or f"candidate_{hash(name) % 10000}@example.com",
            "phone": phone or "+91 98765 43210",
            "education": education,
            "experience": experience,
            "skills": ", ".join(skills) if skills else "Python, Problem Solving",
            "resume_text": text
        }
