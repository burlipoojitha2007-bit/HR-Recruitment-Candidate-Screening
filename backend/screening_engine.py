import re
from typing import List, Dict, Any, Set, Tuple

# Common skill synonym / alias mapping for realistic NLP-style normalization
SKILL_ALIASES = {
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "dl": "deep learning",
    "nlp": "natural language processing",
    "cv": "computer vision",
    "js": "javascript",
    "ts": "typescript",
    "react": "react",
    "react.js": "react",
    "reactjs": "react",
    "vue": "vue",
    "vue.js": "vue",
    "node": "node.js",
    "nodejs": "node.js",
    "postgres": "postgresql",
    "psql": "postgresql",
    "mongo": "mongodb",
    "aws": "amazon web services",
    "gcp": "google cloud platform",
    "k8s": "kubernetes",
    "docker": "docker",
    "rest": "rest api",
    "fastapi": "fastapi",
    "django": "django",
    "flask": "flask",
    "py": "python"
}

# Education hierarchy weights (DMGT lattice / ordering)
EDUCATION_RANKS = {
    "phd": 5,
    "doctorate": 5,
    "mtech": 4,
    "me": 4,
    "ms": 4,
    "mca": 4,
    "master": 4,
    "mba": 4,
    "msc": 4,
    "btech": 3,
    "be": 3,
    "bca": 2.5,
    "bsc": 2.5,
    "bachelor": 3,
    "diploma": 2,
    "high school": 1,
    "any graduate": 2.5
}

class ScreeningEngine:
    """
    Object-Oriented Candidate Screening Engine.
    
    Academic Foundations:
    - DMGT: Set theory (intersection, difference, cardinality), predicate logic,
            Boolean decision rules for eligibility classification.
    - ADSA: Algorithmic scoring with weighted linear combinations, normalized
            similarity metrics, and priority threshold classification.
    - OOP: Encapsulated logic, modular state handling, and explicit scoring components.
    """

    def __init__(
        self,
        weights: Dict[str, float] = None
    ):
        # Default Weights matching project requirements:
        # Skills: 50%, Experience: 20%, Education: 15%, Preferred Skills: 10%, Keywords: 5%
        self.weights = weights or {
            "skills": 0.50,
            "experience": 0.20,
            "education": 0.15,
            "preferred_skills": 0.10,
            "keyword": 0.05
        }

    @staticmethod
    def normalize_skill(skill: str) -> str:
        """Clean and normalize a skill string, handling common abbreviations."""
        s = skill.strip().lower()
        s = re.sub(r'[^a-z0-9\.\#\+]', ' ', s)
        s = ' '.join(s.split())
        return SKILL_ALIASES.get(s, s)

    @classmethod
    def parse_skills_to_set(cls, skills_input: Any) -> Set[str]:
        """Convert comma-separated string or list of skills into a normalized set."""
        if not skills_input:
            return set()
        if isinstance(skills_input, list):
            items = skills_input
        else:
            items = re.split(r'[,;\n|/]', str(skills_input))
        
        normalized = set()
        for item in items:
            cleaned = cls.normalize_skill(item)
            if cleaned:
                normalized.add(cleaned)
        return normalized

    def calculate_skill_score(
        self,
        candidate_skills: Set[str],
        required_skills: Set[str]
    ) -> Tuple[float, List[str]]:
        """
        DMGT Set Theory Application:
        Matched Skills = Candidate_Skills ∩ Required_Skills
        Missing Skills = Required_Skills \ Candidate_Skills
        Score = (|Matched| / |Required|) * 100
        """
        if not required_skills:
            return 100.0, []

        matched = candidate_skills.intersection(required_skills)
        missing = required_skills.difference(candidate_skills)

        # Partial matching check for compound skills (e.g., "fastapi" in "fastapi framework")
        unmatched_req = set()
        for req in missing:
            matched_partial = False
            for cand in candidate_skills:
                if req in cand or cand in req:
                    matched.add(req)
                    matched_partial = True
                    break
            if not matched_partial:
                unmatched_req.add(req)

        score = (len(matched) / len(required_skills)) * 100.0
        return round(min(score, 100.0), 1), sorted(list(unmatched_req))

    def calculate_preferred_skill_score(
        self,
        candidate_skills: Set[str],
        preferred_skills: Set[str]
    ) -> float:
        """
        Computes bonus/preferred skills matching percentage.
        """
        if not preferred_skills:
            return 100.0  # If no preferred skills specified, give full score

        matched = candidate_skills.intersection(preferred_skills)
        for pref in preferred_skills:
            if pref not in matched:
                for cand in candidate_skills:
                    if pref in cand or cand in pref:
                        matched.add(pref)
                        break

        score = (len(matched) / len(preferred_skills)) * 100.0
        return round(min(score, 100.0), 1)

    def calculate_experience_score(
        self,
        candidate_exp: float,
        required_exp: float
    ) -> float:
        """
        Calculates experience fit score based on ratio and threshold curves.
        If required_exp is 0, any candidate gets 100%.
        """
        if required_exp <= 0:
            # Entry level role - full score for zero, slight bonus for some experience
            return 100.0

        if candidate_exp >= required_exp:
            # Exceeds or meets required experience
            # Caps at 100% (or slight diminishing return for overqualification)
            ratio = candidate_exp / required_exp
            if ratio > 3.0:
                return 95.0  # Slightly penalize severe overqualification
            return 100.0
        else:
            # Partial score based on proportion
            score = (candidate_exp / required_exp) * 100.0
            return round(max(score, 0.0), 1)

    def calculate_education_score(
        self,
        candidate_edu: str,
        required_edu: str
    ) -> float:
        """
        Evaluates candidate degree level against required degree level using rank lattice.
        """
        c_text = candidate_edu.lower()
        r_text = required_edu.lower()

        # Find maximum rank in candidate education string
        c_rank = 2.5
        for deg, rank in EDUCATION_RANKS.items():
            if deg in c_text:
                if rank > c_rank:
                    c_rank = rank

        # Find required rank
        r_rank = 2.5
        for deg, rank in EDUCATION_RANKS.items():
            if deg in r_text:
                if rank > r_rank:
                    r_rank = rank

        if c_rank >= r_rank:
            return 100.0
        elif c_rank == r_rank - 0.5:
            return 80.0
        elif c_rank == r_rank - 1.0:
            return 60.0
        else:
            return 40.0

    def calculate_keyword_score(
        self,
        resume_text: str,
        job_description: str,
        all_job_skills: Set[str]
    ) -> float:
        """
        Analyzes keyword and contextual term occurrences within resume text.
        """
        if not resume_text or not job_description:
            return 75.0  # Sensible default if plain resume isn't provided

        text_lower = resume_text.lower()
        desc_words = set(re.findall(r'\b[a-z]{3,}\b', job_description.lower()))
        
        # Stopwords filter
        stopwords = {
            "the", "and", "for", "with", "this", "that", "from", "have", "been",
            "will", "your", "work", "role", "team", "looking", "candidate", "about"
        }
        domain_keywords = desc_words.difference(stopwords).union(all_job_skills)
        if not domain_keywords:
            return 80.0

        hits = sum(1 for kw in domain_keywords if kw in text_lower)
        coverage = (hits / min(len(domain_keywords), 20)) * 100.0
        return round(min(max(coverage, 30.0), 100.0), 1)

    def calculate_fit_score(
        self,
        skills_score: float,
        experience_score: float,
        education_score: float,
        preferred_skills_score: float,
        keyword_score: float
    ) -> float:
        """
        Computes composite fit score (0-100) using weighted multi-criteria summation:
        Fit Score = 0.50*Skills + 0.20*Exp + 0.15*Edu + 0.10*Pref + 0.05*Keyword
        """
        fit = (
            (skills_score * self.weights["skills"]) +
            (experience_score * self.weights["experience"]) +
            (education_score * self.weights["education"]) +
            (preferred_skills_score * self.weights["preferred_skills"]) +
            (keyword_score * self.weights["keyword"])
        )
        return round(min(max(fit, 0.0), 100.0), 1)

    def determine_eligibility(
        self,
        fit_score: float,
        skills_score: float,
        missing_skills: List[str]
    ) -> str:
        """
        DMGT Decision Rules:
        - Eligible: Fit Score >= 75 AND Skills Score >= 60
        - Review: 50 <= Fit Score < 75 OR (Fit Score >= 75 but critical required skill missing)
        - Not Eligible: Fit Score < 50
        """
        if fit_score >= 75.0:
            # If too many required skills are missing (e.g., > 50% missing), downgrade to Review
            if skills_score < 50.0:
                return "Review"
            return "Eligible"
        elif 50.0 <= fit_score < 75.0:
            return "Review"
        else:
            return "Not Eligible"

    def generate_screening_reason(
        self,
        fit_score: float,
        eligibility: str,
        missing_skills: List[str],
        candidate_exp: float,
        required_exp: float,
        education_score: float
    ) -> str:
        """Generates clear, explainable recruitment rationale for HR decision support."""
        reasons = []

        if missing_skills:
            reasons.append(f"Missing required skill(s): {', '.join(missing_skills[:3])}")
        
        if candidate_exp < required_exp:
            reasons.append(f"Experience ({candidate_exp} yrs) below requirement ({required_exp} yrs)")

        if education_score < 70.0:
            reasons.append("Education qualification does not fully match required criteria")

        if eligibility == "Eligible":
            if fit_score >= 90:
                return "Exceptional candidate profile exceeding core job competencies. Recommended for immediate interview."
            elif not missing_skills:
                return "Comprehensive skill match and meets all baseline job requirements. Recommended for shortlist."
            else:
                return f"Strong overall profile ({fit_score}%). Minor skill gaps: {', '.join(missing_skills)}."
        elif eligibility == "Review":
            gap_summary = "; ".join(reasons) if reasons else "Moderate alignment with job specifications"
            return f"Requires recruiter review: {gap_summary}. Fit score is {fit_score}%."
        else:
            gap_summary = "; ".join(reasons) if reasons else "Insufficient skill overlap with role requirements"
            return f"Not eligible: {gap_summary}. Overall fit score {fit_score}% is below threshold."

    def screen(
        self,
        candidate_skills_raw: Any,
        candidate_exp: float,
        candidate_edu: str,
        candidate_resume: str,
        required_skills_raw: Any,
        preferred_skills_raw: Any,
        required_exp: float,
        required_edu: str,
        job_description: str
    ) -> Dict[str, Any]:
        """
        Full end-to-end evaluation pipeline.
        Returns comprehensive screening metrics dictionary.
        """
        cand_skills = self.parse_skills_to_set(candidate_skills_raw)
        req_skills = self.parse_skills_to_set(required_skills_raw)
        pref_skills = self.parse_skills_to_set(preferred_skills_raw)

        # 1. Skills Match (50%)
        skills_score, missing_skills = self.calculate_skill_score(cand_skills, req_skills)

        # 2. Experience Match (20%)
        experience_score = self.calculate_experience_score(candidate_exp, required_exp)

        # 3. Education Match (15%)
        education_score = self.calculate_education_score(candidate_edu, required_edu)

        # 4. Preferred Skills Match (10%)
        preferred_skills_score = self.calculate_preferred_skill_score(cand_skills, pref_skills)

        # 5. Keyword Relevance (5%)
        all_skills = req_skills.union(pref_skills)
        keyword_score = self.calculate_keyword_score(candidate_resume, job_description, all_skills)

        # Overall Fit Score
        fit_score = self.calculate_fit_score(
            skills_score=skills_score,
            experience_score=experience_score,
            education_score=education_score,
            preferred_skills_score=preferred_skills_score,
            keyword_score=keyword_score
        )

        # Eligibility Classification
        eligibility = self.determine_eligibility(fit_score, skills_score, missing_skills)

        # Explainable Reason
        reason = self.generate_screening_reason(
            fit_score=fit_score,
            eligibility=eligibility,
            missing_skills=missing_skills,
            candidate_exp=candidate_exp,
            required_exp=required_exp,
            education_score=education_score
        )

        return {
            "fit_score": fit_score,
            "skills_score": skills_score,
            "experience_score": experience_score,
            "education_score": education_score,
            "preferred_skills_score": preferred_skills_score,
            "keyword_score": keyword_score,
            "eligibility": eligibility,
            "missing_skills": missing_skills,
            "reason": reason
        }
