import React, { useState } from 'react';
import { X, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { Candidate, Job, Recruiter, Interview } from '../types';
import { AcademicBadge } from './AcademicBadge';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: Omit<Interview, 'id'>) => void;
  candidate: Candidate;
  job: Job;
  recruiters: Recruiter[];
  activeRecruiter: Recruiter;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  candidate,
  job,
  recruiters,
  activeRecruiter
}) => {
  const [interviewerName, setInterviewerName] = useState('Vikram Kashyap (VP of Engineering)');
  const [round, setRound] = useState<Interview['round']>('Technical Round 1');
  const [scheduledDate, setScheduledDate] = useState('2026-10-10');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM - 12:00 PM IST');
  const [recruiterId, setRecruiterId] = useState<number>(activeRecruiter.id);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      applicationId: candidate.appliedJobId * 100 + candidate.id,
      candidateId: candidate.id,
      jobId: job.id,
      recruiterId,
      interviewerName,
      round,
      scheduledDate,
      scheduledTime,
      status: 'Scheduled',
      rating: 4
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Schedule Interview Round</h2>
              <AcademicBadge subject="OOPJ" size="sm" showLabel={false} />
            </div>
            <p className="text-xs text-slate-500">
              For {candidate.fullName} • {job.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Round</label>
            <select
              value={round}
              onChange={e => setRound(e.target.value as any)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="Technical Round 1">Technical Round 1: Coding & Algorithmic Problem Solving</option>
              <option value="Technical Round 2">Technical Round 2: Architecture & Framework Deep Dive</option>
              <option value="System Design">System Design: Scalability, DB & Microservices</option>
              <option value="HR & Behavioral">HR & Behavioral: Culture Fit & Compensation</option>
              <option value="Management">Management: Leadership & Delivery Review</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Interviewer / Panelist</label>
            <input
              type="text"
              required
              value={interviewerName}
              onChange={e => setInterviewerName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Interview Date</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time Window</label>
              <input
                type="text"
                required
                placeholder="11:00 AM - 12:30 PM IST"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Managing Recruiter</label>
            <select
              value={recruiterId}
              onChange={e => setRecruiterId(Number(e.target.value))}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {recruiters.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800">
            Scheduling this interview automatically updates candidate status to <strong>'Interview'</strong> in the ATS state machine and logs an audit timestamp.
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Send Calendar Invite</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
