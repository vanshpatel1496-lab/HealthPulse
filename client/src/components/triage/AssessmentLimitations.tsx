import React from 'react';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface AssessmentLimitationsProps {
  informationComplete: boolean;
  missingInformation: string[];
}

export const AssessmentLimitations: React.FC<AssessmentLimitationsProps> = ({
  informationComplete,
  missingInformation,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-slate-500" />
        Assessment Completeness & Scope Limitations
      </h3>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-600">
        <div className="flex items-center gap-2">
          {informationComplete ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Core intake information sufficient for preliminary triage
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" /> Intake has missing details that may impact assessment
            </span>
          )}
        </div>

        {missingInformation.length > 0 && (
          <div className="pt-1">
            <span className="text-[11px] font-medium text-slate-500 block mb-1">
              Information not available during intake:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
              {missingInformation.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-100">
          This AI assessment is strictly observational and cannot perform physical examinations, order diagnostic tests, or prescribe medications.
        </p>
      </div>
    </div>
  );
};
