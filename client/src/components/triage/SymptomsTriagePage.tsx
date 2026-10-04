import React, { useState, useEffect } from 'react';
import { TriageSession } from '@healthpulse/shared';
import {
  fetchTriageSessions,
  createTriageSession,
  sendTriageMessage,
  evaluateTriageSessionApi,
} from '../../services/triage.service';
import { TriageConversation } from './TriageConversation';
import { ActiveIntakeSummary } from './ActiveIntakeSummary';
import { CompletedTriageSession } from './CompletedTriageSession';
import { SymptomHistoryList } from './SymptomHistoryList';
import { TriageProgress } from './TriageProgress';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Button } from '../common/Button';
import { AlertCircle, History, Sparkles, PlusCircle } from 'lucide-react';

interface SymptomsTriagePageProps {
  onOpenEmergencyModal?: () => void;
}

export const SymptomsTriagePage: React.FC<SymptomsTriagePageProps> = ({
  onOpenEmergencyModal,
}) => {
  const [sessions, setSessions] = useState<TriageSession[]>([]);
  const [activeSession, setActiveSession] = useState<TriageSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMobileHistory, setShowMobileHistory] = useState<boolean>(false);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchTriageSessions();
      setSessions(data);
      if (data.length > 0) {
        // Prefer an in-progress session if available, else latest
        const inProgress = data.find((s) => s.session_status === 'in_progress');
        setActiveSession(inProgress || data[0]);
      } else {
        // Create an initial session if none exists
        await handleStartNewSession();
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to connect to HealthPulse triage services.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewSession = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const newSession = await createTriageSession();
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
      setShowMobileHistory(false);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to initialize symptom check.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSession) return;
    setErrorMessage(null);
    try {
      // Auto-extract severity hint if mentioned in text
      let severityTier = activeSession.intake_summary.severity_tier;
      if (/severe|intense|unbearable/i.test(content)) severityTier = 'severe';
      else if (/moderate|fairly bad/i.test(content)) severityTier = 'moderate';
      else if (/mild|slight|minor/i.test(content)) severityTier = 'mild';

      // Auto-extract main symptom if not yet recorded
      const mainSymptom =
        activeSession.intake_summary.main_symptom || content.slice(0, 80);

      const updated = await sendTriageMessage(activeSession.session_id, content, {
        severity_tier: severityTier,
        main_symptom: mainSymptom,
      });

      setActiveSession(updated);
      setSessions((prev) =>
        prev.map((s) => (s.session_id === updated.session_id ? updated : s))
      );
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Message transmission failed.'
      );
    }
  };

  const handleUpdateSeverity = async (tier: 'mild' | 'moderate' | 'severe') => {
    if (!activeSession) return;
    try {
      const updated = await sendTriageMessage(
        activeSession.session_id,
        `I would classify the intensity of my symptom as ${tier}.`,
        { severity_tier: tier }
      );
      setActiveSession(updated);
      setSessions((prev) =>
        prev.map((s) => (s.session_id === updated.session_id ? updated : s))
      );
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to update symptom severity.'
      );
    }
  };

  const handleEvaluate = async () => {
    if (!activeSession) return;
    setIsEvaluating(true);
    setErrorMessage(null);
    try {
      const updated = await evaluateTriageSessionApi(activeSession.session_id);
      setActiveSession(updated);
      setSessions((prev) =>
        prev.map((s) => (s.session_id === updated.session_id ? updated : s))
      );
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Clinical triage evaluation failed. Please seek immediate medical care if you are in distress.'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  const isCompleted = activeSession?.session_status === 'completed';
  const hasMessages = (activeSession?.messages.length || 0) >= 2;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Symptoms & Clinical Triage
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Preliminary symptom intake and observational care urgency guidance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile history toggle */}
          <button
            onClick={() => setShowMobileHistory((prev) => !prev)}
            className="md:hidden px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 min-h-[36px]"
          >
            <History className="w-3.5 h-3.5 text-teal-700" />
            <span>History ({sessions.length})</span>
          </button>

          <Button
            variant="primary"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={handleStartNewSession}
          >
            New Symptom Check
          </Button>
        </div>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Triage Notice</span>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs font-bold text-rose-900 underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Responsive 3-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Session History (Desktop & Tablet) */}
        <div className={`lg:col-span-1 ${showMobileHistory ? 'block' : 'hidden lg:block'}`}>
          <SymptomHistoryList
            sessions={sessions}
            activeSessionId={activeSession?.session_id || null}
            onSelectSession={(session) => {
              setActiveSession(session);
              setShowMobileHistory(false);
            }}
            onStartNewSession={handleStartNewSession}
          />
        </div>

        {/* Center & Right Columns: Active Intake Stream OR Completed Summary */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading && !activeSession ? (
            <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
              <Sparkles className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Initializing HealthPulse Triage Assistant...
              </p>
            </div>
          ) : isEvaluating ? (
            <TriageProgress />
          ) : activeSession && isCompleted ? (
            <CompletedTriageSession
              session={activeSession}
              onStartNewSession={handleStartNewSession}
              onOpenEmergencyModal={onOpenEmergencyModal}
            />
          ) : activeSession ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Conversational Stream (2 Cols) */}
              <div className="md:col-span-2">
                <TriageConversation
                  sessionId={activeSession.session_id}
                  messages={activeSession.messages}
                  onSendMessage={handleSendMessage}
                  onRequestEvaluation={handleEvaluate}
                  isEvaluating={isEvaluating}
                  canEvaluate={hasMessages}
                />
              </div>

              {/* Live Intake Summary (1 Col) */}
              <div className="md:col-span-1">
                <ActiveIntakeSummary
                  intake={activeSession.intake_summary}
                  onUpdateSeverity={handleUpdateSeverity}
                  disabled={isEvaluating}
                />
              </div>
            </div>
          ) : null}

          {/* Medical Disclaimer Footer */}
          {!isCompleted && <DisclaimerBanner type="triage" />}
        </div>
      </div>
    </div>
  );
};
