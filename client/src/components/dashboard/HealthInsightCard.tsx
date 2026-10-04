import React from 'react';
import { HealthInsight } from '@healthpulse/shared';
import { Lightbulb, TrendingUp, Target } from 'lucide-react';

interface HealthInsightCardProps {
  insight: HealthInsight;
}

export const HealthInsightCard: React.FC<HealthInsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-teal-700" />;
      case 'target':
        return <Target className="w-4 h-4 text-amber-600" />;
      case 'observation':
      default:
        return <Lightbulb className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        {getIcon()}
      </div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
            {insight.category}
          </span>
          <span className="text-[10px] text-slate-400">{insight.observedAt}</span>
        </div>
        <p className="text-slate-700 leading-relaxed font-medium">{insight.message}</p>
      </div>
    </div>
  );
};
