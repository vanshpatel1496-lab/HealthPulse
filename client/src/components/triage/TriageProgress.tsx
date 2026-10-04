import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

interface TriageProgressProps {
  statusMessage?: string;
}

export const TriageProgress: React.FC<TriageProgressProps> = ({
  statusMessage = 'Analyzing symptom constellation against clinical triage parameters...',
}) => {
  return (
    <div className="p-8 rounded-2xl bg-white border border-teal-200 shadow-clinical-card text-center space-y-4 max-w-md mx-auto animate-fadeIn">
      <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
        <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-900">
          Generating Clinical Guidance Summary
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {statusMessage}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-teal-700 font-medium">
        <ShieldCheck className="w-4 h-4" />
        <span>Validated with non-diagnostic clinical safety constraints</span>
      </div>
    </div>
  );
};
