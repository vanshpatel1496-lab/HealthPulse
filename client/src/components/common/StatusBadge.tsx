import React from 'react';
import clsx from 'clsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

export type StatusType = 'normal' | 'attention' | 'high' | 'emergency' | 'info' | 'neutral';

export interface StatusBadgeProps {
  status: StatusType;
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className,
}) => {
  const styles = {
    normal: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
    },
    attention: {
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
    },
    high: {
      badge: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />,
    },
    emergency: {
      badge: 'bg-rose-50 text-rose-800 border-rose-200 ring-1 ring-rose-500/20 font-bold',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
    },
    info: {
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      icon: <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />,
    },
    neutral: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
    },
  }[status];

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        sizeClass,
        styles.badge,
        className
      )}
    >
      {styles.icon}
      <span>{label}</span>
    </span>
  );
};
