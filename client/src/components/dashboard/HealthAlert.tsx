import React from 'react';
import { HealthAlertItem } from '@healthpulse/shared';
import { CheckCircle2, AlertTriangle, AlertCircle, Flame, PhoneCall } from 'lucide-react';
import { Button } from '../common/Button';

interface HealthAlertProps {
  alert: HealthAlertItem;
  onOpenEmergencyModal?: () => void;
}

export const HealthAlert: React.FC<HealthAlertProps> = ({
  alert,
  onOpenEmergencyModal,
}) => {
  const isEmergency = alert.severity === 'emergency';

  const getStyle = () => {
    switch (alert.severity) {
      case 'emergency':
        return {
          card: 'bg-rose-50 border-2 border-rose-300 text-rose-950',
          iconBox: 'bg-rose-600 text-white',
          icon: <Flame className="w-4 h-4 text-white" />,
          badge: 'bg-rose-600 text-white',
          badgeText: 'Emergency',
        };
      case 'high_priority':
        return {
          card: 'bg-orange-50 border border-orange-300 text-orange-950',
          iconBox: 'bg-orange-600 text-white',
          icon: <AlertCircle className="w-4 h-4 text-white" />,
          badge: 'bg-orange-100 text-orange-900 border border-orange-300',
          badgeText: 'High Priority',
        };
      case 'attention':
        return {
          card: 'bg-amber-50 border border-amber-200 text-amber-950',
          iconBox: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-4 h-4 text-white" />,
          badge: 'bg-amber-100 text-amber-900 border border-amber-200',
          badgeText: 'Attention',
        };
      case 'normal':
      default:
        return {
          card: 'bg-emerald-50/70 border border-emerald-200 text-emerald-950',
          iconBox: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-4 h-4 text-white" />,
          badge: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
          badgeText: 'Stable',
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`p-4 rounded-xl flex items-start justify-between gap-3 text-xs ${style.card}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.iconBox}`}>
          {style.icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
              {style.badgeText}
            </span>
            <span className="font-bold text-slate-900">{alert.title}</span>
            <span className="text-[10px] text-slate-400 font-normal">• {alert.timestamp}</span>
          </div>
          <p className="leading-relaxed opacity-90">{alert.message}</p>
        </div>
      </div>

      {isEmergency ? (
        <Button
          variant="emergency"
          size="sm"
          icon={<PhoneCall className="w-3.5 h-3.5" />}
          onClick={onOpenEmergencyModal}
          className="shrink-0"
        >
          Get Emergency Help
        </Button>
      ) : alert.actionLabel ? (
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 shrink-0 min-h-[36px]"
        >
          {alert.actionLabel}
        </button>
      ) : null}
    </div>
  );
};
