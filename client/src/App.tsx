import React, { useState } from 'react';
import { AppShell } from './components/shell/AppShell';
import { NavigationItemKey } from './components/shell/PersistentSidebar';
import { PatientVitalsDashboard } from './components/dashboard/PatientVitalsDashboard';
import { MedicalDocumentVaultPage } from './components/documents/MedicalDocumentVaultPage';
import { SymptomsTriagePage } from './components/triage/SymptomsTriagePage';
import { HealthInsightsPage } from './components/insights/HealthInsightsPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationItemKey>('dashboard');

  return (
    <AppShell
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      documentCount={2}
    >
      {({ onOpenEmergencyModal }) => (
        <>
          {currentTab === 'dashboard' && (
            <PatientVitalsDashboard
              onNavigateToTriage={() => setCurrentTab('triage')}
              onNavigateToDocuments={() => setCurrentTab('documents')}
              onOpenEmergencyModal={onOpenEmergencyModal}
            />
          )}
          {currentTab === 'documents' && <MedicalDocumentVaultPage />}
          {currentTab === 'triage' && (
            <SymptomsTriagePage onOpenEmergencyModal={onOpenEmergencyModal} />
          )}
          {currentTab === 'insights' && (
            <HealthInsightsPage
              onNavigateToDocuments={() => setCurrentTab('documents')}
              onOpenEmergencyModal={onOpenEmergencyModal}
            />
          )}
          {currentTab === 'settings' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200">
              <h1 className="text-xl font-bold text-slate-900">Application Settings</h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage your personal medical profile, privacy preferences, and biometric sensor connections.
              </p>
            </div>
          )}
        </>
      )}
    </AppShell>
  );
};

export default App;
