import React from 'react';
import { Flame, ShieldAlert, PhoneCall } from 'lucide-react';
import { Button } from '../common/Button';

interface EmergencyTriageStateProps {
  suggestedNextStep?: string;
  onOpenEmergencyModal?: () => void;
}

export const EmergencyTriageState: React.FC<EmergencyTriageStateProps> = ({
  suggestedNextStep,
  onOpenEmergencyModal,
}) => {
  return (
    <div className="p-5 md:p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-md space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white">
                Emergency
              </span>
              <span className="text-xs font-semibold text-rose-900">
                Critical Care Escalation Required
              </span>
            </div>
            <h2 className="text-base font-bold text-rose-950 mt-1">
              Immediate Clinical Attention Required
            </h2>
          </div>
        </div>

        <Button
          variant="emergency"
          size="md"
          icon={<PhoneCall className="w-4 h-4" />}
          onClick={onOpenEmergencyModal}
          className="shadow-sm"
        >
          Get Emergency Help
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-white/80 border border-rose-200 text-xs text-rose-900 space-y-2">
        <p className="font-semibold text-sm leading-snug">
          {suggestedNextStep ||
            'Seek immediate emergency medical care or contact your local emergency services.'}
        </p>
        <p className="text-[11px] text-rose-700 leading-relaxed">
          Do not delay evaluation. If you are unable to transport yourself safely, have someone assist you or contact local emergency medical response services immediately.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-rose-700">
        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
        <span>HealthPulse preliminary guidance is not a diagnosis and must not delay emergency care.</span>
      </div>
    </div>
  );
};
