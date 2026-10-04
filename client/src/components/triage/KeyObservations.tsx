import React from 'react';
import { Eye } from 'lucide-react';

interface KeyObservationsProps {
  observations: string[];
}

export const KeyObservations: React.FC<KeyObservationsProps> = ({ observations }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-teal-700" />
        Clinical Observations
      </h3>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <ul className="space-y-2 text-xs text-slate-700">
          {observations.map((obs, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
              <span className="leading-relaxed">{obs}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
