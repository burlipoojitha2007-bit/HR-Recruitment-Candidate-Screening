import { Candidate, Job, DegreeLevel, FitBreakdown, FitCategory } from '../types';

/**
 * ACADEMIC MODULE: PYTHON - CANDIDATE FIT-SCORE CLASSIFIER
 * 
 * Simulates a Python Scikit-Learn / NLTK / NumPy candidate ranking module.
 * 
 * Formula:
 * Total Fit Score (100%) =
 *    Skills Match (50%)
 *  + Experience Match (25%)
 *  + Education Match (15%)
 *  + Job Description Semantic Similarity (10%)
 * 
 * Classification:
 *  80 - 100 -> High Match
 *  60 -  79 -> Medium Match
 *   0 -  59 -> Low Match
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few',
  'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself',
  'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you'
]);

export class PythonFitClassifier {
  /**
   * Tokenizes text and removes stop words (simulates nltk.word_tokenize and English stopword filtering)
   */
  private static tokenize(text: string): string[] {
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9+#]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2 && !STOP_WORDS.has(token));
  }

  /**
   * Simulates Python TF-IDF cosine similarity between Resume and Job Description
   */
  public static calculateTextSimilarity(resumeText: string, jobDescription: string): number {
    const resumeTokens = this.tokenize(resumeText);
    const jobTokens = this.tokenize(jobDescription);

    if (jobTokens.length === 0 || resumeTokens.length === 0) return 0.5;

    // Calculate term frequencies
    const resumeFreq: Record<string, number> = {};
    const jobFreq: Record<string, number> = {};

    resumeTokens.forEach(t => { resumeFreq[t] = (resumeFreq[t] || 0) + 1; });
    jobTokens.forEach(t => { jobFreq[t] = (jobFreq[t] || 0) + 1; });

    // Compute Dot Product and Vector Magnitudes
    let dotProduct = 0;
    let resumeMagSq = 0;
    let jobMagSq = 0;

    const allKeys = new Set([...Object.keys(resumeFreq), ...Object.keys(jobFreq)]);

    allKeys.forEach(term => {
      const r = resumeFreq[term] || 0;
      const j = jobFreq[term] || 0;
      dotProduct += r * j;
      resumeMagSq += r * r;
      jobMagSq += j * j;
    });

    const magnitude = Math.sqrt(resumeMagSq) * Math.sqrt(jobMagSq);
    if (magnitude === 0) return 0;

    // Cosine similarity between 0 and 1
    const rawCosine = dotProduct / magnitude;
    // Normalize to a realistic resume-match range (0.35 to 1.0)
    return Math.min(1.0, Math.max(0, rawCosine * 1.8));
  }

  /**
   * Python-style scoring pipeline:
   * def calculate_candidate_fit(candidate: dict, job: dict) -> FitBreakdown:
   */
  public static calculateFitScore(
    candidate: Partial<Candidate>,
    job: Job,
    customWeights = { skills: 0.50, experience: 0.25, education: 0.15, jdSimilarity: 0.10 }
  ): FitBreakdown {
    const candidateSkillsLower = (candidate.skills || []).map(s => s.trim().toLowerCase());
    const requiredLower = job.requiredSkills.map(s => s.trim().toLowerCase());
    const preferredLower = (job.preferredSkills || []).map(s => s.trim().toLowerCase());

    // 1. SKILLS MATCH (50 points max)
    let matchedRequiredCount = 0;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    job.requiredSkills.forEach(req => {
      if (candidateSkillsLower.includes(req.toLowerCase())) {
        matchedRequiredCount++;
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    let matchedPreferredCount = 0;
    job.preferredSkills.forEach(pref => {
      if (candidateSkillsLower.includes(pref.toLowerCase())) {
        matchedPreferredCount++;
        if (!matchedSkills.includes(pref)) {
          matchedSkills.push(pref);
        }
      }
    });

    const reqTotal = requiredLower.length || 1;
    const prefTotal = preferredLower.length || 1;

    // 80% weight on required, 20% weight on preferred
    const reqRatio = matchedRequiredCount / reqTotal;
    const prefRatio = preferredLower.length > 0 ? (matchedPreferredCount / prefTotal) : 1;
    const combinedSkillRatio = (reqRatio * 0.8) + (prefRatio * 0.2);

    const skillsMatchPoints = Math.round(combinedSkillRatio * (customWeights.skills * 100) * 10) / 10;

    // 2. EXPERIENCE MATCH (25 points max)
    const candExp = candidate.yearsOfExperience ?? 0;
    const minExp = job.minimumExperience;
    let expRatio = 1.0;

    if (minExp > 0) {
      if (candExp >= minExp) {
        // Full points plus small bonus up to 1.1x for extra senior depth
        const extraYears = candExp - minExp;
        expRatio = Math.min(1.0, 0.85 + (extraYears * 0.05));
      } else {
        // Pro-rated penalty
        expRatio = Math.max(0, candExp / minExp * 0.75);
      }
    } else {
      expRatio = 1.0;
    }

    const experienceMatchPoints = Math.round(expRatio * (customWeights.experience * 100) * 10) / 10;

    // 3. EDUCATION MATCH (15 points max)
    const degreeHierarchy: Record<DegreeLevel, number> = {
      Diploma: 1,
      Bachelors: 2,
      Masters: 3,
      PhD: 4,
    };

    const candDeg = candidate.degreeLevel || 'Bachelors';
    const reqDeg = job.minDegreeLevel || 'Bachelors';
    const candDegScore = degreeHierarchy[candDeg] || 2;
    const reqDegScore = degreeHierarchy[reqDeg] || 2;

    let eduRatio = 1.0;
    if (candDegScore >= reqDegScore) {
      eduRatio = 1.0;
      // Bonus if advanced degree
      if (candDegScore > reqDegScore) {
        eduRatio = 1.0;
      }
    } else {
      eduRatio = candDegScore / reqDegScore; // e.g. 1 / 2 = 0.5
    }

    const educationMatchPoints = Math.round(eduRatio * (customWeights.education * 100) * 10) / 10;

    // 4. JOB-DESCRIPTION SIMILARITY (10 points max)
    const cosineSim = this.calculateTextSimilarity(
      candidate.resumeText || (candidate.skills || []).join(' '),
      job.jobDescription
    );

    const descriptionSimilarityPoints = Math.round(cosineSim * (customWeights.jdSimilarity * 100) * 10) / 10;

    // Sum Total
    const rawTotal = skillsMatchPoints + experienceMatchPoints + educationMatchPoints + descriptionSimilarityPoints;
    const total = Math.min(100, Math.max(0, Math.round(rawTotal)));

    // Classification
    let category: FitCategory = 'Low Match';
    if (total >= 80) {
      category = 'High Match';
    } else if (total >= 60) {
      category = 'Medium Match';
    } else {
      category = 'Low Match';
    }

    return {
      skillsMatch: Math.min(50, skillsMatchPoints),
      experienceMatch: Math.min(25, experienceMatchPoints),
      educationMatch: Math.min(15, educationMatchPoints),
      descriptionSimilarity: Math.min(10, descriptionSimilarityPoints),
      total,
      category,
      details: {
        matchedSkills,
        missingSkills,
        skillMatchPercentage: Math.round(combinedSkillRatio * 100),
        expDiff: candExp - minExp,
        eduMatched: candDegScore >= reqDegScore,
        simScorePercentage: Math.round(cosineSim * 100)
      }
    };
  }
}
