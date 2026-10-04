import React, { useState } from 'react';
import { PersistentSidebar, NavigationItemKey } from './PersistentSidebar';
import { GlobalHeader } from './GlobalHeader';
import { EmergencyModal } from './EmergencyModal';

export interface AppShellProps {
  currentTab: NavigationItemKey;
  onSelectTab: (tab: NavigationItemKey) => void;
  documentCount?: number;
  children:
    | React.ReactNode
    | ((props: { onOpenEmergencyModal: () => void }) => React.ReactNode);
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  documentCount = 2,
  children,
}) => {
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Persistent Left Sidebar */}
      <PersistentSidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        documentCount={documentCount}
        onEmergencyClick={() => setEmergencyOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <GlobalHeader onEmergencyClick={() => setEmergencyOpen(true)} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {typeof children === 'function'
            ? (children as (props: { onOpenEmergencyModal: () => void }) => React.ReactNode)({
                onOpenEmergencyModal: () => setEmergencyOpen(true),
              })
            : children}
        </main>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  );
};
