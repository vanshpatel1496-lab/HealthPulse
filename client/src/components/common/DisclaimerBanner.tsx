import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export interface DisclaimerBannerProps {
  type: 'document' | 'triage' | 'security';
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ type, className }) => {
  const content = {
    document: {
      text: 'Extracted information helps organize your health records and may contain errors. Refer to the original medical document and consult a qualified healthcare professional for medical interpretation.',
      icon: <Shield className="w-4 h-4 text-slate-500 shrink-0" />,
    },
    triage: {
      text: 'HealthPulse provides preliminary health guidance and does not provide a medical diagnosis or replace a qualified healthcare professional. If you are experiencing a life-threatening medical emergency, seek immediate emergency medical care.',
      icon: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
    },
    security: {
      text: 'Health information is handled as sensitive data. Do not use this demonstration environment for real protected health information unless appropriate production security and compliance controls are configured.',
      icon: <Shield className="w-4 h-4 text-teal-600 shrink-0" />,
    },
  }[type];

  return (
    <div
      className={clsx(
        'flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed',
        className
      )}
    >
      {content.icon}
      <span>{content.text}</span>
    </div>
  );
};
