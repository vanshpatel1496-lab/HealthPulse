import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningSignsProps {
  warningSigns: string[];
}

export const WarningSigns: React.FC<WarningSignsProps> = ({ warningSigns }) => {
  if (warningSigns.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Red-Flag Warning Signs
      </h3>
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
        <ul className="space-y-1.5 text-xs text-amber-900">
          {warningSigns.map((sign, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{sign}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
