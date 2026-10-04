import React from 'react';
import { Shield, Bell, ChevronDown, AlertCircle } from 'lucide-react';

export interface GlobalHeaderProps {
  onEmergencyClick: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onEmergencyClick }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Privacy & Security Baseline Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs text-slate-700">
        <Shield className="w-3.5 h-3.5 text-teal-700 shrink-0" />
        <span className="font-medium">Personal Health Record • Demo Workspace</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Emergency Assistance Button */}
        <button
          onClick={onEmergencyClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors min-h-[36px]"
          aria-label="Get Emergency Help"
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Get Emergency Help</span>
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Patient Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            ER
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Elena Rostova</div>
            <div className="text-[10px] text-emerald-700 font-medium leading-tight">Patient Verified</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
