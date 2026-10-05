import React from 'react';

export function ScoreBadge({ score, size = "md", showLabel = false }) {
  const numScore = Math.round(Number(score) || 0);

  let colorClasses = "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
  let barColor = "bg-rose-500";
  if (numScore >= 75) {
    colorClasses = "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    barColor = "bg-emerald-500";
  } else if (numScore >= 50) {
    colorClasses = "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    barColor = "bg-amber-500";
  }

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
        {numScore}%
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center">
        <div className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 ${numScore >= 75 ? 'border-emerald-500' : numScore >= 50 ? 'border-amber-500' : 'border-rose-500'} bg-white shadow-sm`}>
          <span className="text-2xl font-bold tracking-tight text-slate-800">{numScore}%</span>
        </div>
        {showLabel && <span className="mt-1 text-xs font-medium text-slate-500">AI Fit Score</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${colorClasses}`}>
        {numScore}%
      </span>
      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(numScore, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function EligibilityBadge({ eligibility }) {
  const norm = (eligibility || "").toLowerCase();

  if (norm.includes("eligible") && !norm.includes("not")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Eligible
      </span>
    );
  }
  if (norm.includes("review")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
      Not Eligible
    </span>
  );
}

export function StatusBadge({ status }) {
  const norm = (status || "").toLowerCase();

  const styles = {
    shortlisted: "bg-teal-50 text-teal-700 border-teal-200",
    interview: "bg-indigo-50 text-indigo-700 border-indigo-200",
    screened: "bg-blue-50 text-blue-700 border-blue-200",
    review: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-slate-100 text-slate-600 border-slate-200 line-through decoration-slate-400",
  };

  const styleClass = styles[norm] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border capitalize ${styleClass}`}>
      {status || "Screened"}
    </span>
  );
}
