import React from 'react';
import { VitalCardData } from '@healthpulse/shared';
import { Heart, Activity, Moon, Droplets } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface VitalCardProps {
  card: VitalCardData;
}

export const VitalCard: React.FC<VitalCardProps> = ({ card }) => {
  const getIcon = () => {
    switch (card.metric) {
      case 'heart_rate':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'blood_pressure':
        return <Activity className="w-5 h-5 text-teal-700" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'spo2':
        return <Droplets className="w-5 h-5 text-sky-600" />;
      default:
        return <Activity className="w-5 h-5 text-teal-700" />;
    }
  };

  // Generate SVG Sparkline coordinates from historyPoints
  const renderSparkline = (points: number[]) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 26;

    const coordinates = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    return (
      <svg
        className="w-20 h-7 overflow-visible shrink-0"
        viewBox={`0 0 ${width} ${height}`}
        aria-label={`7-day trend sparkline for ${card.label}`}
        role="img"
      >
        <polyline
          fill="none"
          stroke={card.deltaPositive ? '#0D9488' : '#F59E0B'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coordinates.join(' ')}
        />
        {/* End Dot */}
        {coordinates.length > 0 && (
          <circle
            cx={coordinates[coordinates.length - 1].split(',')[0]}
            cy={coordinates[coordinates.length - 1].split(',')[1]}
            r="3"
            fill={card.deltaPositive ? '#0F766E' : '#D97706'}
          />
        )}
      </svg>
    );
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card flex flex-col justify-between hover:border-teal-300 transition-colors">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {getIcon()}
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <StatusBadge status={card.status === 'normal' ? 'normal' : 'attention'} label={card.statusLabel} size="sm" />
        </div>

        <div className="my-3.5 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {card.value}
            </span>
            <span className="text-xs font-semibold text-slate-500">{card.unit}</span>
          </div>
          {renderSparkline(card.historyPoints)}
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          {card.baselineRange}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] mt-2">
        <span
          className={`font-semibold flex items-center gap-1 ${
            card.deltaPositive ? 'text-teal-700' : 'text-amber-700'
          }`}
        >
          {card.deltaText}
        </span>
        <span className="text-slate-400 font-normal">{card.timestamp}</span>
      </div>
    </div>
  );
};
