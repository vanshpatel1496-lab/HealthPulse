import {
  VitalsDashboardData,
  VitalCardData,
} from '../types/vitals.js';
import { StandardApiResponse } from './apiError.js';

export interface VitalsResponse {
  dashboard: VitalsDashboardData;
}

export interface LogVitalReadingRequest {
  metric: 'blood_pressure' | 'heart_rate' | 'sleep' | 'spo2' | 'glucose';
  numericValue: number;
  secondaryValue?: number;
  unit: string;
}

export interface LogVitalReadingResponse {
  vital: VitalCardData;
}

export type VitalsApiResponse = StandardApiResponse<VitalsResponse>;
export type LogVitalReadingApiResponse = StandardApiResponse<LogVitalReadingResponse>;
