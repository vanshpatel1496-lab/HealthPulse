import React from 'react';
import { StructuredIntakeSummary } from '@healthpulse/shared';
import { Clock, Activity, Tag, HelpCircle } from 'lucide-react';

interface ActiveIntakeSummaryProps {
  intake: StructuredIntakeSummary;
  onUpdateSeverity?: (severity: 'mild' | 'moderate' | 'severe') => void;
  disabled?: boolean;
}

export const ActiveIntakeSummary: React.FC<ActiveIntakeSummaryProps> = ({
  intake,
  onUpdateSeverity,
  disabled = false,
}) => {
  const getSeverityBadge = (tier: string) => {
    switch (tier) {
      case 'severe':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Severe</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-900">Moderate</span>;
      case 'mild':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">Mild</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">Pending intake</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-clinical-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-teal-700" />
          Active Intake Summary
        </h2>
        {getSeverityBadge(intake.severity_tier)}
      </div>

      <div className="space-y-3 text-xs">
        {/* Main Symptom */}
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Chief Symptom</span>
          <span className="font-semibold text-slate-900 text-sm block mt-0.5">
            {intake.main_symptom || 'Awaiting initial symptom description...'}
          </span>
        </div>

        {/* Duration / Onset */}
        <div className="flex items-start gap-2 pt-1">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[11px] text-slate-400 block">Onset / Duration</span>
            <span className="font-medium text-slate-800">
              {intake.started || 'Not specified yet'}
            </span>
          </div>
        </div>

        {/* Severity Selector */}
        <div className="pt-1">
          <span className="text-[11px] text-slate-400 block mb-1.5">Intensity / Severity Tier</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['mild', 'moderate', 'severe'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                disabled={disabled}
                onClick={() => onUpdateSeverity?.(tier)}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold capitalize transition-colors min-h-[36px] ${
                  intake.severity_tier === tier
                    ? tier === 'severe'
                      ? 'bg-rose-700 text-white'
                      : tier === 'moderate'
                      ? 'bg-amber-600 text-white'
                      : 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                } disabled:opacity-50`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Associated Symptoms */}
        <div className="pt-1">
          <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            Associated Symptoms
          </span>
          {intake.associated_symptoms.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {intake.associated_symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[11px] bg-teal-50 text-teal-800 border border-teal-200 font-medium"
                >
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-slate-400 italic text-[11px]">None recorded</span>
          )}
        </div>

        {/* Progression */}
        {intake.progression && (
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 block">Progression</span>
            <span className="font-medium text-slate-800">{intake.progression}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-400">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>Fields update continuously as you answer questions in the conversation.</span>
      </div>
    </div>
  );
};
