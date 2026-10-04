import React, { useState } from 'react';
import { TriageSession } from '@healthpulse/shared';
import { TriageSummary } from './TriageSummary';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { ChatMessage } from './ChatMessage';
import { PlusCircle, MessageSquare, ChevronDown, ChevronUp, Printer, Calendar } from 'lucide-react';

interface CompletedTriageSessionProps {
  session: TriageSession;
  onStartNewSession: () => void;
  onOpenEmergencyModal?: () => void;
}

export const CompletedTriageSession: React.FC<CompletedTriageSessionProps> = ({
  session,
  onStartNewSession,
  onOpenEmergencyModal,
}) => {
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  const formattedDate = new Date(session.updated_at).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Completed Session Top Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-900">Session #{session.session_id}</span>
            <span className="text-slate-300">•</span>
            <StatusBadge status="normal" label="Completed Review" size="sm" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Completed on {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={() => window.print()}
          >
            Print Summary
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-3.5 h-3.5" />}
            onClick={onStartNewSession}
          >
            New Symptom Check
          </Button>
        </div>
      </div>

      {/* Structured Triage Summary */}
      {session.evaluation ? (
        <TriageSummary
          evaluation={session.evaluation}
          onOpenEmergencyModal={onOpenEmergencyModal}
        />
      ) : (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
          No clinical evaluation record was generated for this session.
        </div>
      )}

      {/* Collapsible Original Intake Transcript */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-clinical-card">
        <button
          onClick={() => setShowTranscript((prev) => !prev)}
          className="w-full p-4 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <span>View Full Conversation Transcript ({session.messages.length} messages)</span>
          </div>
          {showTranscript ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showTranscript && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3 max-h-96 overflow-y-auto">
            {session.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
