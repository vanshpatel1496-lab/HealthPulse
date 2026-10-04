import React from 'react';
import { LabTestItem, TestFlag } from '@healthpulse/shared';
import { AlertTriangle, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface LabResultTableProps {
  tests: LabTestItem[];
  isEditing?: boolean;
  onUpdateTest?: (index: number, updated: LabTestItem) => void;
}

export const LabResultTable: React.FC<LabResultTableProps> = ({
  tests,
  isEditing = false,
  onUpdateTest,
}) => {
  if (tests.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
        No laboratory test items extracted from this record.
      </div>
    );
  }

  const getFlagBadge = (flag: TestFlag) => {
    switch (flag) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            <ArrowUpRight className="w-3 h-3 text-amber-700" />
            High
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-900 border border-sky-200">
            <ArrowDownRight className="w-3 h-3 text-sky-700" />
            Low
          </span>
        );
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            Normal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold text-[10px]">
          <tr>
            <th className="py-2.5 px-3">Test Name</th>
            <th className="py-2.5 px-3">Result Value</th>
            <th className="py-2.5 px-3">Unit</th>
            <th className="py-2.5 px-3">Reference Range</th>
            <th className="py-2.5 px-3 text-center">Status Flag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {tests.map((test, idx) => (
            <tr
              key={`${test.test_name}-${idx}`}
              className={test.flag === 'critical' ? 'bg-rose-50/40' : 'hover:bg-slate-50/50'}
            >
              <td className="py-2.5 px-3 font-medium text-slate-900">
                {isEditing ? (
                  <input
                    type="text"
                    value={test.test_name}
                    onChange={(e) =>
                      onUpdateTest?.(idx, { ...test, test_name: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                ) : (
                  <span>{test.test_name}</span>
                )}
              </td>

              <td className="py-2.5 px-3 font-bold text-slate-800">
                {isEditing ? (
                  <input
                    type="text"
                    value={test.value}
                    onChange={(e) =>
                      onUpdateTest?.(idx, { ...test, value: e.target.value })
                    }
                    className="w-20 px-2 py-1 text-xs border border-slate-300 rounded font-bold"
                  />
                ) : (
                  <span>{test.value}</span>
                )}
              </td>

              <td className="py-2.5 px-3 text-slate-500">
                {isEditing ? (
                  <input
                    type="text"
                    value={test.unit}
                    onChange={(e) =>
                      onUpdateTest?.(idx, { ...test, unit: e.target.value })
                    }
                    className="w-16 px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                ) : (
                  <span>{test.unit || '—'}</span>
                )}
              </td>

              <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                {isEditing ? (
                  <input
                    type="text"
                    value={test.reference_range}
                    onChange={(e) =>
                      onUpdateTest?.(idx, { ...test, reference_range: e.target.value })
                    }
                    className="w-24 px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                  />
                ) : (
                  <span>{test.reference_range || '—'}</span>
                )}
              </td>

              <td className="py-2.5 px-3 text-center">
                {isEditing ? (
                  <select
                    value={test.flag}
                    onChange={(e) =>
                      onUpdateTest?.(idx, {
                        ...test,
                        flag: e.target.value as TestFlag,
                      })
                    }
                    className="px-2 py-1 text-xs border border-slate-300 rounded"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                    <option value="critical">Critical</option>
                    <option value="unknown">Unknown</option>
                  </select>
                ) : (
                  getFlagBadge(test.flag)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
