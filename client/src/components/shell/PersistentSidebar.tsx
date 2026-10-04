import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  TrendingUp,
  Settings,
  AlertOctagon,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';

export type NavigationItemKey = 'dashboard' | 'documents' | 'triage' | 'insights' | 'settings';

export interface PersistentSidebarProps {
  currentTab: NavigationItemKey;
  onSelectTab: (tab: NavigationItemKey) => void;
  documentCount?: number;
  onEmergencyClick: () => void;
}

export const PersistentSidebar: React.FC<PersistentSidebarProps> = ({
  currentTab,
  onSelectTab,
  documentCount = 2,
  onEmergencyClick,
}) => {
  const navItems = [
    {
      key: 'dashboard' as NavigationItemKey,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      key: 'documents' as NavigationItemKey,
      label: 'Medical Documents',
      icon: <FileText className="w-5 h-5 shrink-0" />,
      badge: documentCount > 0 ? documentCount : undefined,
    },
    {
      key: 'triage' as NavigationItemKey,
      label: 'Symptoms & Triage',
      icon: <Stethoscope className="w-5 h-5 shrink-0" />,
    },
    {
      key: 'insights' as NavigationItemKey,
      label: 'Health Insights',
      icon: <TrendingUp className="w-5 h-5 shrink-0" />,
    },
    {
      key: 'settings' as NavigationItemKey,
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand & Patient Sync Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V20" stroke="#99F6E4" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M4 12H8L10 7L14 17L16 12H20"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
              HealthPulse
            </h1>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Personal Health & Records</p>
          </div>
        </div>

        {/* Patient Telemetry Sync Pill */}
        <div className="mt-4 px-2.5 py-1.5 rounded-lg bg-teal-50/70 border border-teal-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
          <span className="text-xs text-teal-800 font-medium truncate">
            Elena Rostova • Synced 08:30 AM
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              className={clsx(
                'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left min-h-[44px]',
                isActive
                  ? 'bg-teal-700 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={clsx(
                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                    isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-700'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Persistent Emergency Callout Dock */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/70">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Emergency Guidance</span>
          </div>
          <p className="text-[11px] text-rose-900/80 mt-1 leading-snug">
            Experiencing severe or sudden life-threatening symptoms?
          </p>
          <button
            onClick={onEmergencyClick}
            className="w-full mt-2.5 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm min-h-[40px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Get Emergency Help</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
