import React, { useRef, useEffect } from 'react';
import { TriageMessage } from '@healthpulse/shared';
import { ChatMessage } from './ChatMessage';
import { QuickResponseOptions } from './QuickResponseOptions';
import { SymptomInputComposer } from './SymptomInputComposer';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TriageConversationProps {
  sessionId: string;
  messages: TriageMessage[];
  onSendMessage: (text: string) => void;
  onRequestEvaluation: () => void;
  isEvaluating: boolean;
  canEvaluate: boolean;
}

export const TriageConversation: React.FC<TriageConversationProps> = ({
  sessionId,
  messages,
  onSendMessage,
  onRequestEvaluation,
  isEvaluating,
  canEvaluate,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isEvaluating]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-clinical-card flex flex-col h-[600px] overflow-hidden">
      {/* Session Conversation Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900">Session #{sessionId}</span>
          <span className="text-xs text-slate-400">• Active Intake</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="info" label="Draft Intake" size="sm" />
          {canEvaluate && (
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={onRequestEvaluation}
              disabled={isEvaluating}
            >
              Get Care Guidance
            </Button>
          )}
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isEvaluating && (
          <div className="flex items-start gap-3 max-w-xl mr-auto animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center text-teal-200 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-sm bg-white border border-teal-200 text-xs text-teal-900 shadow-sm">
              <span className="font-semibold block mb-0.5">Evaluating clinical intake...</span>
              Assessing reported symptoms, urgency tiers, and next steps with safety guardrails.
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer & Quick Responses Footer */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-100 space-y-2">
        <QuickResponseOptions
          onSelectOption={onSendMessage}
          disabled={isEvaluating}
        />
        <SymptomInputComposer
          onSendMessage={onSendMessage}
          disabled={isEvaluating}
          isLoading={isEvaluating}
        />
        {canEvaluate && !isEvaluating && (
          <div className="pt-1 flex justify-end">
            <button
              onClick={onRequestEvaluation}
              className="text-xs text-teal-700 font-semibold hover:text-teal-900 flex items-center gap-1 hover:underline min-h-[36px] px-2 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
            >
              <span>Ready for care guidance? Complete Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
