import { VitalsDashboardData, VitalCardData } from '@healthpulse/shared';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/api/vitals`;

export async function fetchVitalsDashboard(): Promise<VitalsDashboardData> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Unable to retrieve patient health vitals.'
    );
  }
  const result = await response.json();
  return result.data;
}

export async function logVitalReading(
  reading: Partial<VitalCardData>
): Promise<VitalsDashboardData> {
  const response = await fetch(`${API_BASE}/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Unable to record vital reading.'
    );
  }

  const result = await response.json();
  return result.data;
}
