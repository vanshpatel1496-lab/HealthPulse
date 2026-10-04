import React from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

export interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-lg font-bold text-slate-900">
                Get Emergency Help
              </h2>
              <p className="text-xs text-slate-500">Emergency Medical Guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>High-Priority Warning Signs</span>
          </div>
          <p>
            If you or someone near you is experiencing severe symptoms such as sudden crushing chest pain,
            unexplained shortness of breath, loss of speech, facial drooping, or sudden confusion:
          </p>
          <ul className="list-disc pl-4 space-y-1 font-medium text-rose-950">
            <li>Seek immediate emergency medical care or contact your local emergency services.</li>
            <li>Go directly to the nearest hospital emergency department.</li>
            <li>Do not attempt to drive yourself if you feel dizzy or faint.</li>
          </ul>
        </div>

        <div className="mt-4 text-xs text-slate-500 leading-relaxed">
          HealthPulse is an informational triage and document organizing assistant. It does not provide medical diagnoses, contact emergency dispatch, or automatically route to emergency services.
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="emergency"
            onClick={onClose}
          >
            Emergency Guidance
          </Button>
        </div>
      </div>
    </div>
  );
};
