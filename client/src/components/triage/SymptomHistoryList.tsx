import React from 'react';
import { TriageSession } from '@healthpulse/shared';
import { UrgencyBadge } from '../common/UrgencyBadge';
import { StatusBadge } from '../common/StatusBadge';
import { PlusCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '../common/Button';

interface SymptomHistoryListProps {
  sessions: TriageSession[];
  activeSessionId: string | null;
  onSelectSession: (session: TriageSession) => void;
  onStartNewSession: () => void;
  className?: string;
}

export const SymptomHistoryList: React.FC<SymptomHistoryListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onStartNewSession,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-clinical-card p-4 space-y-4 flex flex-col ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Triage History
          </h2>
          <span className="text-[11px] text-slate-400">
            {sessions.length} recorded session{sessions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<PlusCircle className="w-3.5 h-3.5" />}
          onClick={onStartNewSession}
        >
          New Check
        </Button>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
        {sessions.map((session) => {
          const isSelected = session.session_id === activeSessionId;
          const isCompleted = session.session_status === 'completed';
          const title =
            session.intake_summary.main_symptom ||
            (session.messages.find((m) => m.sender === 'patient')?.content) ||
            'General Symptom Inquiry';

          const formattedTime = new Date(session.created_at).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          });

          return (
            <button
              key={session.session_id}
              onClick={() => onSelectSession(session)}
              className={`w-full p-3 rounded-xl border text-left transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isSelected
                  ? 'bg-teal-50/60 border-teal-300 ring-1 ring-teal-200'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {/* Distinct visual separation: Session Status vs Care Urgency */}
              <div className="flex items-center justify-between gap-1 mb-1">
                {/* Session Status Pill */}
                {isCompleted ? (
                  <StatusBadge status="normal" label="Completed" size="sm" />
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                    <Clock className="w-2.5 h-2.5 text-sky-600" />
                    In Progress
                  </span>
                )}

                {/* Urgency Badge (Rendered ONLY if session has been evaluated) */}
                {session.evaluation && (
                  <UrgencyBadge urgency={session.evaluation.urgency} />
                )}
              </div>

              <div className="font-semibold text-slate-900 text-xs line-clamp-1 mt-1">
                {title}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formattedTime}
                </span>
                <span className="font-mono text-[10px]">#{session.session_id.slice(-6)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
