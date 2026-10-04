import React from 'react';
import { HealthInsight, HealthAlertItem } from '@healthpulse/shared';
import { HealthInsightCard } from './HealthInsightCard';
import { HealthAlert } from './HealthAlert';
import { Sparkles, Bell, ArrowRight } from 'lucide-react';

interface HealthInsightsHubProps {
  insights: HealthInsight[];
  alerts: HealthAlertItem[];
  onNavigateToDocuments: () => void;
  onOpenEmergencyModal?: () => void;
}

export const HealthInsightsHub: React.FC<HealthInsightsHubProps> = ({
  insights,
  alerts,
  onNavigateToDocuments,
  onOpenEmergencyModal,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-clinical-card space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            Health Insights & Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Observational telemetry patterns and clinical health indicators
          </p>
        </div>
        <button
          onClick={onNavigateToDocuments}
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded p-1"
        >
          <span>Review Documents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alerts Section (if any alerts exist) */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3 h-3 text-slate-400" />
            Active Baseline Alerts
          </span>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <HealthAlert
                key={alert.id}
                alert={alert}
                onOpenEmergencyModal={onOpenEmergencyModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Observational Insights Section */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Observed Patterns
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight) => (
            <HealthInsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
};
