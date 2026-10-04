import React from 'react';

interface QuickResponseOptionsProps {
  onSelectOption: (optionText: string) => void;
  disabled?: boolean;
}

const DEFAULT_OPTIONS = [
  'No fever or stiff neck',
  'Started about 4 hours ago',
  'Mild sensitivity to light',
  'Symptoms are worsening',
  'Mild intensity (2-3/10)',
  'Moderate intensity (5-6/10)',
  'Severe discomfort (8-10/10)',
];

export const QuickResponseOptions: React.FC<QuickResponseOptionsProps> = ({
  onSelectOption,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-2">
      <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick replies:</span>
      {DEFAULT_OPTIONS.map((option, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelectOption(option)}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 text-[11px] font-medium transition-colors border border-slate-200 disabled:opacity-50 disabled:pointer-events-none min-h-[32px] focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {option}
        </button>
      ))}
    </div>
  );
};
