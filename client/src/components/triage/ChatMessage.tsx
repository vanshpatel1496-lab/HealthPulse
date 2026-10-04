import React from 'react';
import { TriageMessage } from '@healthpulse/shared';
import { Sparkles, User } from 'lucide-react';

interface ChatMessageProps {
  message: TriageMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.sender === 'assistant';

  return (
    <div
      className={`flex items-start gap-3 ${
        isAssistant ? 'max-w-2xl mr-auto' : 'max-w-xl ml-auto flex-row-reverse'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isAssistant
            ? 'bg-teal-700 text-teal-100'
            : 'bg-slate-700 text-slate-100'
        }`}
        aria-hidden="true"
      >
        {isAssistant ? <Sparkles className="w-4 h-4 text-teal-200" /> : <User className="w-4 h-4" />}
      </div>

      <div
        className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
          isAssistant
            ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
            : 'bg-teal-700 text-white rounded-tr-sm'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-4 mb-1 text-[10px] font-semibold ${
            isAssistant ? 'text-teal-900' : 'text-teal-100'
          }`}
        >
          <span>{isAssistant ? 'HealthPulse Triage Assistant' : 'You (Patient)'}</span>
          <span className="opacity-75 font-normal">{message.timestamp}</span>
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
