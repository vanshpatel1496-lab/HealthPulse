import {
  TriageSession,
  StructuredIntakeSummary,
} from '@healthpulse/shared';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/api/triage`;

export async function fetchTriageSessions(): Promise<TriageSession[]> {
  const response = await fetch(`${API_BASE}/sessions`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Unable to load symptom triage sessions.'
    );
  }
  const result = await response.json();
  return result.data;
}

export async function fetchTriageSessionById(id: string): Promise<TriageSession> {
  const response = await fetch(`${API_BASE}/sessions/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Unable to retrieve triage session details.'
    );
  }
  const result = await response.json();
  return result.data;
}

export async function createTriageSession(initialSymptom?: string): Promise<TriageSession> {
  const response = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initial_symptom: initialSymptom }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Failed to start a new symptom triage session.'
    );
  }

  const result = await response.json();
  return result.data;
}

export async function sendTriageMessage(
  sessionId: string,
  content: string,
  updatedIntake?: Partial<StructuredIntakeSummary>
): Promise<TriageSession> {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, updated_intake: updatedIntake }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Failed to submit triage message.'
    );
  }

  const result = await response.json();
  return result.data;
}

export async function evaluateTriageSessionApi(sessionId: string): Promise<TriageSession> {
  const response = await fetch(`${API_BASE}/sessions/${sessionId}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage ||
        'Unable to evaluate symptoms at this time. If your symptoms are severe or worsening, please consult a healthcare professional or seek immediate emergency medical care.'
    );
  }

  const result = await response.json();
  return result.data;
}
