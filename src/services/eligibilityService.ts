import { Candidate, Job, DegreeLevel, EligibilityStatus } from '../types';

/**
 * ACADEMIC MODULE: JAVA - ELIGIBILITY FILTER
 * 
 * Simulates a robust Java Business Rules Engine (e.g. Drools or Spring Service)
 * Implements strict type validation, predicate rule chains, and explicit reason generation.
 * 
 * Rules Evaluated:
 * 1. Educational Degree Hierarchy Verification
 * 2. Mandatory Skill Set Completeness (All required skills must be present)
 * 3. Minimum Years of Professional Experience Threshold
 * 4. Job Posting Availability Verification
 */

const DEGREE_WEIGHTS: Record<DegreeLevel, number> = {
  Diploma: 1,
  Bachelors: 2,
  Masters: 3,
  PhD: 4,
};

export interface EligibilityResult {
  status: EligibilityStatus;
  isEligible: boolean;
  reasons: string[];
  missingSkills: string[];
  experienceDeficit: number;
  educationPassed: boolean;
  skillsPassed: boolean;
  experiencePassed: boolean;
  jobStatusPassed: boolean;
  auditTrail: {
    ruleName: string;
    passed: boolean;
    expected: string;
    actual: string;
    message: string;
  }[];
}

export class JavaEligibilityFilter {
  /**
   * Main evaluation entrypoint mimicking a Java Service component
   * public EligibilityResult evaluateCandidateEligibility(Candidate candidate, Job job)
   */
  public static evaluate(
    candidate: Partial<Candidate>,
    job: Job
  ): EligibilityResult {
    const reasons: string[] = [];
    const auditTrail: EligibilityResult['auditTrail'] = [];

    // Rule 1: Job Opening Status Check
    const jobStatusPassed = job.status === 'Active';
    auditTrail.push({
      ruleName: 'JobStatusPredicate',
      passed: jobStatusPassed,
      expected: 'Active',
      actual: job.status,
      message: jobStatusPassed
        ? 'Job requisition is active and accepting applications'
        : 'Job requisition is closed or in draft status'
    });
    if (!jobStatusPassed) {
      reasons.push(`Job opening is currently ${job.status}`);
    }

    // Rule 2: Education Level Check
    const candidateDegree = candidate.degreeLevel || 'Bachelors';
    const candidateDegWeight = DEGREE_WEIGHTS[candidateDegree] || 1;
    const requiredDegWeight = DEGREE_WEIGHTS[job.minDegreeLevel] || 2;
    const educationPassed = candidateDegWeight >= requiredDegWeight;

    auditTrail.push({
      ruleName: 'EducationHierarchyPredicate',
      passed: educationPassed,
      expected: `Minimum: ${job.educationRequirement} (${job.minDegreeLevel})`,
      actual: `${candidate.education || 'Not Specified'} (${candidateDegree})`,
      message: educationPassed
        ? 'Candidate education meets or exceeds minimum degree requirement'
        : `Candidate degree level (${candidateDegree}) is below required (${job.minDegreeLevel})`
    });

    if (!educationPassed) {
      reasons.push(
        `Required education missing – Expected ${job.educationRequirement}, but candidate holds ${candidate.education || candidateDegree}`
      );
    }

    // Rule 3: Minimum Experience Check
    const candidateExp = candidate.yearsOfExperience ?? 0;
    const requiredExp = job.minimumExperience;
    const experiencePassed = candidateExp >= requiredExp;
    const experienceDeficit = Math.max(0, requiredExp - candidateExp);

    auditTrail.push({
      ruleName: 'ExperienceThresholdPredicate',
      passed: experiencePassed,
      expected: `>= ${requiredExp} years`,
      actual: `${candidateExp} years`,
      message: experiencePassed
        ? `Experience requirement satisfied (${candidateExp} yrs >= ${requiredExp} yrs)`
        : `Insufficient experience: deficient by ${experienceDeficit.toFixed(1)} years`
    });

    if (!experiencePassed) {
      reasons.push(
        `Minimum experience required is ${requiredExp} yrs, but candidate has ${candidateExp} yrs (deficit of ${experienceDeficit.toFixed(1)} yrs)`
      );
    }

    // Rule 4: Mandatory Skills Check
    const candidateSkillsLower = (candidate.skills || []).map(s => s.trim().toLowerCase());
    const missingSkills: string[] = [];

    job.requiredSkills.forEach(reqSkill => {
      const isPresent = candidateSkillsLower.includes(reqSkill.trim().toLowerCase());
      if (!isPresent) {
        missingSkills.push(reqSkill);
      }
    });

    const skillsPassed = missingSkills.length === 0;

    auditTrail.push({
      ruleName: 'MandatorySkillsPredicate',
      passed: skillsPassed,
      expected: `Must possess all: [${job.requiredSkills.join(', ')}]`,
      actual: `Possesses: [${(candidate.skills || []).join(', ')}]`,
      message: skillsPassed
        ? 'Candidate holds all mandatory core competencies'
        : `Missing ${missingSkills.length} mandatory skill(s): ${missingSkills.join(', ')}`
    });

    if (!skillsPassed) {
      reasons.push(`Required skill(s) missing: ${missingSkills.join(', ')}`);
    }

    const isEligible = educationPassed && experiencePassed && skillsPassed && jobStatusPassed;

    return {
      status: isEligible ? 'Eligible' : 'Not Eligible',
      isEligible,
      reasons,
      missingSkills,
      experienceDeficit,
      educationPassed,
      skillsPassed,
      experiencePassed,
      jobStatusPassed,
      auditTrail
    };
  }
}
