import React, { useState, useEffect } from 'react';
import { VitalsDashboardData, VitalCardData } from '@healthpulse/shared';
import { fetchVitalsDashboard, logVitalReading } from '../../services/vitals.service';
import { HealthSummary } from './HealthSummary';
import { VitalCard } from './VitalCard';
import { HealthTrendChart } from './HealthTrendChart';
import { DailyHealthOverview } from './DailyHealthOverview';
import { HealthInsightsHub } from './HealthInsightsHub';
import { Button } from '../common/Button';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Plus, Stethoscope, RefreshCw, AlertCircle, X, Shield } from 'lucide-react';

export interface PatientVitalsDashboardProps {
  onNavigateToTriage: () => void;
  onNavigateToDocuments: () => void;
  onOpenEmergencyModal?: () => void;
}

export const PatientVitalsDashboard: React.FC<PatientVitalsDashboardProps> = ({
  onNavigateToTriage,
  onNavigateToDocuments,
  onOpenEmergencyModal,
}) => {
  const [data, setData] = useState<VitalsDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [logMetric, setLogMetric] = useState<'heart_rate' | 'blood_pressure' | 'sleep' | 'spo2'>('heart_rate');
  const [logValue, setLogValue] = useState<string>('');
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);

  const loadVitals = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchVitalsDashboard();
      setData(result);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to load health vitals telemetry from the server.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVitals();
  }, []);

  const handleLogVitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logValue.trim()) return;

    setIsSubmittingLog(true);
    try {
      const numeric = parseFloat(logValue);
      const updatePayload: Partial<VitalCardData> = {
        metric: logMetric,
        value: logValue,
        numericValue: isNaN(numeric) ? 0 : numeric,
      };

      const updated = await logVitalReading(updatePayload);
      setData(updated);
      setIsLogModalOpen(false);
      setLogValue('');
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to record vital entry.');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {data?.patient ? `${data.patient.name}'s Health Overview` : 'Health Overview'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
              Demo Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-teal-700" />
            <span>Simulated wearable biometric telemetry and clinical laboratory records</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="md"
            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={loadVitals}
            aria-label="Refresh vitals telemetry"
          >
            Refresh
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsLogModalOpen(true)}
          >
            Log Vital
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={<Stethoscope className="w-4 h-4" />}
            onClick={onNavigateToTriage}
          >
            Ask Clinical Triage
          </Button>
        </div>
      </div>

      {/* Error state alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={loadVitals}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !data ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">Loading physiological vitals telemetry...</p>
        </div>
      ) : data ? (
        <>
          {/* Health Summary Banner */}
          <HealthSummary summary={data.summary} />

          {/* Four Primary Cards Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <VitalCard card={data.cards.heart_rate} />
            <VitalCard card={data.cards.blood_pressure} />
            <VitalCard card={data.cards.sleep} />
            <VitalCard card={data.cards.spo2} />
          </div>

          {/* Health Trends Visualizer */}
          <HealthTrendChart trends={data.trends} />

          {/* Daily Health Overview */}
          <DailyHealthOverview indicators={data.daily} />

          {/* Health Insights Hub */}
          <HealthInsightsHub
            insights={data.insights}
            alerts={data.alerts}
            onNavigateToDocuments={onNavigateToDocuments}
            onOpenEmergencyModal={onOpenEmergencyModal}
          />
        </>
      ) : null}

      {/* Security & Privacy Safeguard Banner */}
      <DisclaimerBanner type="security" />

      {/* Log Vital Modal Dialog */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Log Physiological Vital</h2>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogVitalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Select Metric
                </label>
                <select
                  value={logMetric}
                  onChange={(e) => setLogMetric(e.target.value as typeof logMetric)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                >
                  <option value="heart_rate">Resting Heart Rate (bpm)</option>
                  <option value="blood_pressure">Blood Pressure (mmHg, e.g. 118/78)</option>
                  <option value="sleep">Sleep Duration (hrs)</option>
                  <option value="spo2">Blood Oxygen SpO2 (%)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Reading Value
                </label>
                <input
                  type="text"
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  placeholder="e.g. 65 for HR, 120/80 for BP, 7.5 for Sleep"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-teal-500 min-h-[44px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLogModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingLog || !logValue.trim()}
                >
                  {isSubmittingLog ? 'Saving...' : 'Record Vital'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
