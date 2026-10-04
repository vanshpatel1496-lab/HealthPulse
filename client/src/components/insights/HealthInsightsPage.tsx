import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { VitalsDashboardData } from '@healthpulse/shared';
import { fetchVitalsDashboard } from '../../services/vitals.service';
import { HealthTrendChart } from '../dashboard/HealthTrendChart';
import { HealthInsightsHub } from '../dashboard/HealthInsightsHub';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { StatusBadge } from '../common/StatusBadge';

interface HealthInsightsPageProps {
  onNavigateToDocuments?: () => void;
  onOpenEmergencyModal?: () => void;
}

export const HealthInsightsPage: React.FC<HealthInsightsPageProps> = ({
  onNavigateToDocuments = () => {},
  onOpenEmergencyModal,
}) => {
  const [data, setData] = useState<VitalsDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchVitalsDashboard();
      setData(response);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load health insights telemetry.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Health Insights & Trajectory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Longitudinal trend telemetry, pattern recognition, and observational indicators
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors disabled:opacity-50"
            aria-label="Refresh telemetry data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <StatusBadge status="normal" label="Demo Telemetry" size="sm" />
        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner type="triage" />

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Error loading telemetry:</span> {error}
            <button
              onClick={fetchInsights}
              className="block mt-2 font-semibold underline text-xs text-rose-900"
            >
              Try reloading
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="space-y-6">
          <div className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse p-6" />
          <div className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse p-6" />
        </div>
      )}

      {/* Populated Content */}
      {data && (
        <div className="space-y-6">
          {/* Longitudinal Trend Chart */}
          <HealthTrendChart trends={data.trends} />

          {/* Insights Hub with Alerts & Observational Findings */}
          <HealthInsightsHub
            insights={data.insights}
            alerts={data.alerts}
            onNavigateToDocuments={onNavigateToDocuments}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />

          {/* Clinical summary review footer */}
          <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                  Review Clinical Summary
                </h2>
                <p className="text-xs text-teal-800 mt-0.5">
                  {data.summary.summaryText}
                </p>
              </div>
            </div>
            <button
              onClick={onNavigateToDocuments}
              className="text-xs font-bold text-teal-800 hover:text-teal-950 bg-white px-3 py-2 rounded-xl border border-teal-200 shadow-sm shrink-0"
            >
              Examine Medical Documents
            </button>
          </div>
        </div>
      )}

      {/* Security and Privacy Notice */}
      <DisclaimerBanner type="security" />
    </div>
  );
};
