import React from 'react';
import { FitCategory } from '../types';

interface ScoreGaugeProps {
  score: number;
  category?: FitCategory;
  size?: 'sm' | 'md' | 'lg';
  showCategoryBadge?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  category,
  size = 'md',
  showCategoryBadge = true
}) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClasses = {
    ring: 'text-rose-500',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    bar: 'bg-rose-500'
  };

  if (normalizedScore >= 80) {
    colorClasses = {
      ring: 'text-emerald-500',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      bar: 'bg-emerald-500'
    };
  } else if (normalizedScore >= 60) {
    colorClasses = {
      ring: 'text-amber-500',
      bg: 'bg-amber-50',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      bar: 'bg-amber-500'
    };
  }

  const effectiveCategory = category || (normalizedScore >= 80 ? 'High Match' : normalizedScore >= 60 ? 'Medium Match' : 'Low Match');

  // SVG dimensions
  const dims = {
    sm: { size: 36, stroke: 3.5, font: 'text-xs' },
    md: { size: 54, stroke: 4.5, font: 'text-sm' },
    lg: { size: 84, stroke: 6, font: 'text-xl' }
  }[size];

  const radius = (dims.size - dims.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: dims.size, height: dims.size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${dims.size} ${dims.size}`}>
          {/* Background circle */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={dims.stroke}
            className="text-slate-200 fill-transparent"
          />
          {/* Value circle */}
          <circle
            cx={dims.size / 2}
            cy={dims.size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={dims.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colorClasses.ring} fill-transparent transition-all duration-700 ease-out`}
          />
        </svg>
        <span className={`absolute font-bold tracking-tight text-slate-800 ${dims.font}`}>
          {normalizedScore}
        </span>
      </div>

      {showCategoryBadge && (
        <div className="flex flex-col">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${colorClasses.badge}`}>
            {effectiveCategory}
          </span>
          {size === 'lg' && (
            <span className="text-[11px] text-slate-500 mt-0.5">
              {normalizedScore >= 80 ? 'Direct Shortlist Candidate' : normalizedScore >= 60 ? 'Eligible for Evaluation' : 'Below Requisition Threshold'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const ScoreProgressBar: React.FC<{ score: number; label?: string; showLabel?: boolean }> = ({
  score,
  label,
  showLabel = true
}) => {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  const barColor = normalized >= 80 ? 'bg-emerald-500' : normalized >= 60 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1">
          <span>{label || 'Fit Score'}</span>
          <span className="font-bold text-slate-800">{normalized}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
};
