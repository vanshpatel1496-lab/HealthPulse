import React from 'react';
import { DailyIndicator } from '@healthpulse/shared';
import { Moon, Footprints, Droplets, Heart } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface DailyHealthOverviewProps {
  indicators: DailyIndicator[];
}

export const DailyHealthOverview: React.FC<DailyHealthOverviewProps> = ({ indicators }) => {
  const getIcon = (metric: string) => {
    switch (metric) {
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'steps':
        return <Footprints className="w-5 h-5 text-teal-700" />;
      case 'hydration':
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case 'heart_rate':
        return <Heart className="w-5 h-5 text-rose-600" />;
      default:
        return <Heart className="w-5 h-5 text-teal-700" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-clinical-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Daily Physiological Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            24-hour baseline maintenance and lifestyle factors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((ind) => (
          <div
            key={ind.id}
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  {getIcon(ind.metric)}
                </div>
                <StatusBadge
                  status={ind.status === 'normal' ? 'normal' : 'attention'}
                  label={ind.statusLabel}
                  size="sm"
                />
              </div>

              <div className="text-xs font-semibold text-slate-600">{ind.label}</div>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums my-1">
                {ind.value}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">{ind.target}</div>
            </div>

            <div className="pt-2.5 mt-2 border-t border-slate-200/80 text-[11px] text-slate-500 leading-snug">
              {ind.supportingText}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
