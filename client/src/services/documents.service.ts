import {
  MedicalDocumentRecord,
  ExtractedMedicalDocument,
} from '@healthpulse/shared';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/api/documents`;

export async function fetchDocuments(): Promise<MedicalDocumentRecord[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Failed to load medical documents from vault.'
    );
  }
  const result = await response.json();
  return result.data;
}

export async function fetchDocumentById(id: string): Promise<MedicalDocumentRecord> {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Failed to retrieve document details.'
    );
  }
  const result = await response.json();
  return result.data;
}

export async function uploadDocumentFile(file: File): Promise<MedicalDocumentRecord> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage ||
        'Document upload and extraction failed. Please ensure the file is legible and below 25MB.'
    );
  }

  const result = await response.json();
  return result.data;
}

export async function confirmDocumentExtraction(id: string): Promise<MedicalDocumentRecord> {
  const response = await fetch(`${API_BASE}/${id}/confirm`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ confirmed: true }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Unable to confirm document extraction.'
    );
  }

  const result = await response.json();
  return result.data;
}

export async function updateDocumentExtractedData(
  id: string,
  updatedData: ExtractedMedicalDocument
): Promise<MedicalDocumentRecord> {
  const response = await fetch(`${API_BASE}/${id}/extracted`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Unable to save document modifications.'
    );
  }

  const result = await response.json();
  return result.data;
}

export async function flagDocumentForReview(
  id: string,
  reason: string
): Promise<MedicalDocumentRecord> {
  const response = await fetch(`${API_BASE}/${id}/flag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.safeUserMessage || 'Failed to flag document for clinical review.'
    );
  }

  const result = await response.json();
  return result.data;
}
