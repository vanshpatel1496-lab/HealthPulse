import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

interface SymptomInputComposerProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SymptomInputComposer: React.FC<SymptomInputComposerProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || isLoading) return;
    onSendMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your symptom description, duration, or answer..."
        disabled={disabled || isLoading}
        className="flex-1 px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-slate-900 placeholder:text-slate-400 min-h-[44px] transition-all disabled:opacity-60"
        aria-label="Symptom input message"
      />
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={disabled || isLoading || !text.trim()}
        icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        aria-label="Send symptom message"
      >
        Send
      </Button>
    </form>
  );
};
