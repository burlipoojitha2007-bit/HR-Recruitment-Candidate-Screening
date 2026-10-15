import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';

/**
 * Custom Tooltip for Recharts
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700">
        <p className="font-bold text-slate-200">{label || data.name}</p>
        <p className="text-indigo-300 font-semibold mt-0.5">
          {data.name ? `${data.name}: ` : 'Count: '}
          <span className="text-white">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * 1. Candidate Pipeline Funnel Chart (Recharts)
 * Shows recruitment pipeline velocity across stages.
 */
export function PipelineFunnelChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-xs text-slate-400 py-12">No pipeline data available</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 35, bottom: 5 }}
        >
          <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="stage"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || '#6366f1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 2. Skills Distribution Chart (Recharts)
 * Displays top technical competencies across candidate profiles.
 */
export function SkillsDistributionChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-xs text-slate-400 py-12">No skills data available</div>;
  }

  const colors = [
    '#6366f1', '#3b82f6', '#06b6d4', '#10b981',
    '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 20, left: -15, bottom: 25 }}
        >
          <XAxis
            dataKey="skill"
            stroke="#64748b"
            fontSize={10}
            angle={-30}
            textAnchor="end"
            interval={0}
            tickLine={false}
          />
          <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={26}>
            {data.map((entry, index) => (
              <Cell key={`skill-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 3. Fit Score Distribution Chart (Recharts)
 * Histogram of candidate qualifications across score brackets.
 */
export function FitScoreDistributionChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-xs text-slate-400 py-12">No distribution data</div>;
  }

  const getBucketColor = (range) => {
    if (range.includes("90-100")) return "#4f46e5";
    if (range.includes("75-89")) return "#10b981";
    if (range.includes("50-74")) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 20, left: -15, bottom: 5 }}
        >
          <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={36}>
            {data.map((entry, index) => (
              <Cell key={`bucket-${index}`} fill={getBucketColor(entry.range)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * 4. Eligibility Donut Chart (Recharts)
 * Interactive PieChart displaying proportion of Eligible vs Review vs Not Eligible.
 */
export function EligibilityDonutChart({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  if (total === 0) {
    return <div className="text-center text-xs text-slate-400 py-12">No candidate eligibility records</div>;
  }

  return (
    <div className="w-full h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
      <div className="w-48 h-48 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold text-slate-800">{total}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {data.map((item, idx) => {
          const pct = Math.round(((item.value || 0) / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-600">{item.name}:</span>
              <span className="font-bold text-slate-900">{item.value} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
