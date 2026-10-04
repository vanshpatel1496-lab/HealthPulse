import React from 'react';
import clsx from 'clsx';
import { ShieldCheck, AlertTriangle, AlertCircle, Flame } from 'lucide-react';
import { UrgencyLevel } from '@healthpulse/shared';

export interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, className }) => {
  const config = {
    low: {
      label: 'Low Urgency',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
    },
    medium: {
      label: 'Medium Urgency',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
    },
    high: {
      label: 'High Urgency',
      badge: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <AlertCircle className="w-4 h-4 text-orange-600 shrink-0" />,
    },
    emergency: {
      label: 'Emergency Alert',
      badge: 'bg-rose-50 text-rose-800 border-rose-200 ring-2 ring-rose-500/20 font-bold',
      icon: <Flame className="w-4 h-4 text-rose-600 shrink-0" />,
    },
  }[urgency];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm',
        config.badge,
        className
      )}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
