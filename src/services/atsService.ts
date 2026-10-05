import { Candidate, Application, CandidateStatus, ApplicationHistoryItem } from '../types';

/**
 * ACADEMIC MODULE: OOPJ (Object-Oriented Programming with Java)
 * Applicant Tracking System (ATS) State Pattern & Workflow Orchestration
 * 
 * Implements the State Design Pattern for Candidate Lifecycle:
 * Applied -> Eligible -> Shortlisted -> Interview -> Selected / Rejected
 */

export interface StateTransitionResult {
  success: boolean;
  fromStatus: CandidateStatus;
  toStatus: CandidateStatus;
  message: string;
  historyItem: ApplicationHistoryItem;
}

export class AtsWorkflowEngine {
  /**
   * Allowed state transitions map (Finite State Machine)
   */
  private static readonly VALID_TRANSITIONS: Record<CandidateStatus, CandidateStatus[]> = {
    Applied: ['Eligible', 'Rejected'],
    Eligible: ['Shortlisted', 'Interview', 'Rejected', 'Applied'],
    Shortlisted: ['Interview', 'Selected', 'Rejected', 'Eligible'],
    Interview: ['Selected', 'Rejected', 'Shortlisted'],
    Selected: ['Interview', 'Rejected'], // Allow corrections with audit
    Rejected: ['Applied', 'Eligible', 'Shortlisted'] // Allow recruiter reactivation
  };

  /**
   * Validates if a transition is legal
   */
  public static isValidTransition(from: CandidateStatus, to: CandidateStatus): boolean {
    if (from === to) return true;
    const allowed = this.VALID_TRANSITIONS[from] || [];
    return allowed.includes(to);
  }

  /**
   * Executes a state transition with business validation and audit logging
   */
  public static transitionStatus(
    candidate: Candidate,
    newStatus: CandidateStatus,
    recruiterName: string,
    note?: string
  ): StateTransitionResult {
    const fromStatus = candidate.status;

    // Check if legal transition
    if (!this.isValidTransition(fromStatus, newStatus)) {
      return {
        success: false,
        fromStatus,
        toStatus: newStatus,
        message: `Illegal State Transition: Cannot transition candidate directly from '${fromStatus}' to '${newStatus}' in ATS state machine.`,
        historyItem: {
          status: fromStatus,
          timestamp: new Date().toISOString(),
          note: `Rejected invalid transition to ${newStatus}`,
          updatedBy: recruiterName
        }
      };
    }

    // Guard: Warning if trying to shortlist or interview an ineligible candidate
    let auditNote = note || `Candidate transitioned from ${fromStatus} to ${newStatus}`;
    if (candidate.eligibilityStatus === 'Not Eligible' && (newStatus === 'Shortlisted' || newStatus === 'Selected')) {
      auditNote += ` [RECRUITER OVERRIDE: Candidate was flagged as Not Eligible due to: ${(candidate.eligibilityReasons || []).join('; ')}]`;
    }

    const historyItem: ApplicationHistoryItem = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: auditNote,
      updatedBy: recruiterName
    };

    return {
      success: true,
      fromStatus,
      toStatus: newStatus,
      message: `Candidate ${candidate.fullName} successfully transitioned to ${newStatus}.`,
      historyItem
    };
  }

  /**
   * Returns pipeline column metadata with theme colors
   */
  public static getPipelineStages(): {
    status: CandidateStatus;
    label: string;
    description: string;
    color: string;
    bgLight: string;
    border: string;
  }[] {
    return [
      {
        status: 'Applied',
        label: '1. Applied',
        description: 'New resumes received awaiting Java eligibility screening',
        color: 'text-slate-700',
        bgLight: 'bg-slate-100',
        border: 'border-slate-300'
      },
      {
        status: 'Eligible',
        label: '2. Eligible',
        description: 'Passed strict Java rule validation and indexed in B-Tree',
        color: 'text-blue-700',
        bgLight: 'bg-blue-50',
        border: 'border-blue-200'
      },
      {
        status: 'Shortlisted',
        label: '3. Shortlisted',
        description: 'High Python fit score approved by hiring manager',
        color: 'text-indigo-700',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-200'
      },
      {
        status: 'Interview',
        label: '4. Interview',
        description: 'Technical and behavioral evaluation rounds in progress',
        color: 'text-amber-700',
        bgLight: 'bg-amber-50',
        border: 'border-amber-200'
      },
      {
        status: 'Selected',
        label: '5. Selected',
        description: 'Candidate cleared all rounds; offer letter extended',
        color: 'text-emerald-700',
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-200'
      },
      {
        status: 'Rejected',
        label: '6. Rejected',
        description: 'Candidate did not meet criteria or declined requisition',
        color: 'text-rose-700',
        bgLight: 'bg-rose-50',
        border: 'border-rose-200'
      }
    ];
  }
}
