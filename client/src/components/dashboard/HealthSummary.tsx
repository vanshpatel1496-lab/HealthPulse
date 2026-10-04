import React from 'react';
import { OverallHealthSummary } from '@healthpulse/shared';
import { Activity, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface HealthSummaryProps {
  summary: OverallHealthSummary;
}

export const HealthSummary: React.FC<HealthSummaryProps> = ({ summary }) => {
  return (
    <div className="p-5 md:p-6 rounded-2xl bg-teal-50/70 border border-teal-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-teal-950">
              {summary.statusLabel}
            </h2>
            <StatusBadge
              status={summary.status === 'normal' ? 'normal' : 'attention'}
              label="Clinical Medians Aligned"
              size="sm"
            />
            {summary.isDemoData && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/80 border border-teal-200 text-teal-800">
                Simulated Baseline Telemetry
              </span>
            )}
          </div>
          <p className="text-xs text-teal-900/90 leading-relaxed max-w-3xl">
            {summary.summaryText}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end md:self-center shrink-0 border-t md:border-t-0 md:border-l border-teal-200/80 pt-3 md:pt-0 md:pl-5">
        <div className="text-right">
          <span className="text-[10px] font-bold text-teal-800/80 uppercase tracking-wider block">
            Baseline Stability Index
          </span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-extrabold text-teal-950 tabular-nums">
              {summary.stabilityIndex}
            </span>
            <span className="text-xs font-semibold text-teal-700">/ 100</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-teal-800/70 mt-0.5 justify-end">
            <Clock className="w-3 h-3" />
            <span>Updated {summary.lastUpdated}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
