import {
  ExtractedMedicalDocument,
  MedicalDocumentRecord,
} from '../schemas/documentExtraction.schema.js';
import { StandardApiResponse } from './apiError.js';

export interface DocumentUploadResponse {
  record: MedicalDocumentRecord;
}

export interface DocumentListResponse {
  documents: MedicalDocumentRecord[];
  total: number;
}

export interface DocumentDetailResponse {
  document: MedicalDocumentRecord;
}

export interface ConfirmDocumentExtractionRequest {
  confirmed: boolean;
}

export interface UpdateExtractedDataRequest {
  extracted_data: ExtractedMedicalDocument;
}

export interface FlagDocumentRequest {
  flag_reason: string;
}

export type DocumentUploadApiResponse = StandardApiResponse<DocumentUploadResponse>;
export type DocumentListApiResponse = StandardApiResponse<DocumentListResponse>;
export type DocumentDetailApiResponse = StandardApiResponse<DocumentDetailResponse>;
