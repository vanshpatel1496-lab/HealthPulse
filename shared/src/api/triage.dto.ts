import {
  TriageSession,
  TriageEvaluationResult,
} from '../schemas/triage.schema.js';
import { StandardApiResponse } from './apiError.js';

export interface TriageSessionListResponse {
  sessions: TriageSession[];
  total: number;
}

export interface TriageSessionDetailResponse {
  session: TriageSession;
}

export interface TriageEvaluationResponse {
  evaluation: TriageEvaluationResult;
}

export type TriageSessionListApiResponse = StandardApiResponse<TriageSessionListResponse>;
export type TriageSessionDetailApiResponse = StandardApiResponse<TriageSessionDetailResponse>;
export type TriageEvaluationApiResponse = StandardApiResponse<TriageEvaluationResponse>;
