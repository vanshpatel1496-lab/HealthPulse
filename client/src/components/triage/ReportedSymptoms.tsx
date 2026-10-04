import React from 'react';
import { Tag } from 'lucide-react';

interface ReportedSymptomsProps {
  symptoms: string[];
  severity: string;
  duration: string;
}

export const ReportedSymptoms: React.FC<ReportedSymptomsProps> = ({
  symptoms,
  severity,
  duration,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-teal-700" />
          Reported Symptoms & Onset
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">
          Duration: <span className="text-slate-900 font-semibold">{duration}</span> • Severity:{' '}
          <span className="text-slate-900 font-semibold capitalize">{severity}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
          >
            {symptom}
          </span>
        ))}
      </div>
    </div>
  );
};
