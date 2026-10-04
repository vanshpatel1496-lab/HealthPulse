import React from 'react';
import { Compass } from 'lucide-react';

interface SuggestedNextStepProps {
  nextStep: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
}

export const SuggestedNextStep: React.FC<SuggestedNextStepProps> = ({
  nextStep,
  urgency,
}) => {
  const getBoxStyle = () => {
    switch (urgency) {
      case 'emergency':
        return 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
      case 'high':
        return 'bg-orange-50 border-orange-300 text-orange-950';
      case 'medium':
        return 'bg-amber-50 border-amber-300 text-amber-950';
      case 'low':
      default:
        return 'bg-teal-50 border-teal-200 text-teal-950';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <Compass className="w-3.5 h-3.5 text-teal-700" />
        Suggested Care Recommendation
      </h3>
      <div className={`p-4 rounded-xl border text-xs leading-relaxed ${getBoxStyle()}`}>
        <p>{nextStep}</p>
      </div>
    </div>
  );
};
