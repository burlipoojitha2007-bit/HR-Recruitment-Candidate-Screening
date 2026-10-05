import React from 'react';
import { AcademicSubject } from '../types';

interface AcademicBadgeProps {
  subject: AcademicSubject;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ACADEMIC_SUBJECT_MAP: Record<
  AcademicSubject,
  { name: string; role: string; bg: string; text: string; border: string }
> = {
  Java: {
    name: 'Java',
    role: 'Eligibility Filtering & Rule Predicates',
    bg: 'bg-red-50 text-red-700',
    text: 'text-red-700',
    border: 'border-red-200'
  },
  Python: {
    name: 'Python',
    role: 'Fit Score Classifier (50/25/15/10)',
    bg: 'bg-emerald-50 text-emerald-700',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  ADDSA: {
    name: 'ADDSA',
    role: 'B-Tree Candidate Indexing & O(log N) Search',
    bg: 'bg-purple-50 text-purple-700',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  DBMS: {
    name: 'DBMS',
    role: 'Relational Model, Schema & SQL Filtering',
    bg: 'bg-blue-50 text-blue-700',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  DMGT: {
    name: 'DMGT',
    role: 'Relations, Adjacency Matrix & Bipartite Graphs',
    bg: 'bg-amber-50 text-amber-800',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  OOPJ: {
    name: 'OOPJ',
    role: 'ATS Pipeline State Machine & OOP Entities',
    bg: 'bg-indigo-50 text-indigo-700',
    text: 'text-indigo-700',
    border: 'border-indigo-200'
  }
};

export const AcademicBadge: React.FC<AcademicBadgeProps> = ({
  subject,
  size = 'md',
  showLabel = true
}) => {
  const config = ACADEMIC_SUBJECT_MAP[subject] || {
    name: subject,
    role: '',
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
    border: 'border-slate-300'
  };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-bold'
  }[size];

  return (
    <span
      title={`${config.name} Module: ${config.role}`}
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.border} ${sizeClasses} shadow-xs transition-all`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{config.name}</span>
      {showLabel && size !== 'sm' && (
        <span className="opacity-75 font-normal text-[11px] hidden sm:inline">
          • {config.role.split('&')[0].trim()}
        </span>
      )}
    </span>
  );
};
