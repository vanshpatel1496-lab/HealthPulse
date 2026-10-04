import { HealthSemanticStatus } from './common.js';

export type VitalMetric =
  | 'heart_rate'
  | 'blood_pressure'
  | 'sleep'
  | 'spo2'
  | 'glucose';

export interface VitalCardData {
  id: string;
  metric: VitalMetric;
  label: string;
  value: string;
  numericValue: number;
  secondaryValue?: number;
  unit: string;
  timestamp: string;
  status: HealthSemanticStatus;
  statusLabel: string;
  baselineRange: string;
  deltaText: string;
  deltaPositive: boolean;
  historyPoints: number[];
  supportingNote: string;
}

export interface DailyIndicator {
  id: string;
  metric: string;
  label: string;
  value: string;
  target: string;
  status: HealthSemanticStatus;
  statusLabel: string;
  supportingText: string;
}

export interface VitalTrendPoint {
  date: string;
  label: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  sleepHours: number;
  spo2: number;
}

export interface HealthInsight {
  id: string;
  type: 'observation' | 'trend' | 'target';
  category: string;
  message: string;
  observedAt: string;
}

export interface HealthAlertItem {
  id: string;
  severity: HealthSemanticStatus;
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  isEmergencyActionRequired?: boolean;
}

export interface OverallHealthSummary {
  status: HealthSemanticStatus;
  statusLabel: string;
  stabilityIndex: number;
  summaryText: string;
  lastUpdated: string;
  isDemoData: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastSynced: string;
  syncStatus: 'synced' | 'syncing' | 'offline';
  securityBadge: string;
}

export interface VitalsDashboardData {
  patient: PatientProfile;
  cards: {
    heart_rate: VitalCardData;
    blood_pressure: VitalCardData;
    sleep: VitalCardData;
    spo2: VitalCardData;
  };
  summary: OverallHealthSummary;
  daily: DailyIndicator[];
  trends: {
    sevenDays: VitalTrendPoint[];
    thirtyDays: VitalTrendPoint[];
    threeMonths: VitalTrendPoint[];
  };
  insights: HealthInsight[];
  alerts: HealthAlertItem[];
}
