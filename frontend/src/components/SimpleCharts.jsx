import React from 'react';

export function ScoreDistributionBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-xs text-slate-400 py-8">No data available</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  const getBarColor = (range) => {
    if (range.includes("90-100")) return "bg-indigo-600";
    if (range.includes("75-89")) return "bg-emerald-500";
    if (range.includes("50-74")) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const percentage = Math.round((item.count / maxCount) * 100);
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>{item.range}</span>
              <span className="font-bold text-slate-800">{item.count} applicants</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(item.range)}`}
                style={{ width: `${Math.max(percentage, item.count > 0 ? 8 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EligibilityDonutChart({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  if (total === 0) {
    return <div className="text-center text-xs text-slate-400 py-8">No candidate data</div>;
  }

  // Calculate SVG stroke dashes for donut slices
  let cumulative = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
          {data.map((item, idx) => {
            const fraction = item.value / total;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -cumulative * circumference;
            cumulative += fraction;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r={radius}
                stroke={item.color || "#6366f1"}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-800">{total}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {data.map((item, idx) => {
          const pct = Math.round(((item.value || 0) / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-600">{item.name}:</span>
              <span className="font-bold text-slate-900">{item.value} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ApplicationsPerJobBarChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-xs text-slate-400 py-8">No job openings found</div>;
  }

  const maxApplicants = Math.max(...data.map(d => d.applicants), 1);

  return (
    <div className="space-y-3">
      {data.map((job) => {
        const pct = Math.round((job.applicants / maxApplicants) * 100);
        return (
          <div key={job.job_id} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-800 truncate max-w-[200px]">{job.title}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">{job.applicants} applied</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Avg: {job.avg_score}%
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(pct, job.applicants > 0 ? 10 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
