import { z } from 'zod';

export const DocumentTypeEnum = z.enum([
  'lab_report',
  'prescription',
  'discharge_summary',
  'other',
]);
export type DocumentType = z.infer<typeof DocumentTypeEnum>;

export const TestFlagEnum = z.enum([
  'normal',
  'high',
  'low',
  'critical',
  'unknown',
]);
export type TestFlag = z.infer<typeof TestFlagEnum>;

export const ExtractionStatusEnum = z.enum([
  'success',
  'partial',
  'needs_review',
  'failed',
]);
export type ExtractionStatus = z.infer<typeof ExtractionStatusEnum>;

export const LabTestItemSchema = z.object({
  test_name: z.string(),
  value: z.string(),
  unit: z.string(),
  reference_range: z.string(),
  flag: TestFlagEnum,
  needs_review: z.boolean(),
});
export type LabTestItem = z.infer<typeof LabTestItemSchema>;

export const MedicationItemSchema = z.object({
  medication_name: z.string(),
  strength: z.string(),
  form: z.string(),
  dose: z.string(),
  frequency: z.string(),
  duration: z.string(),
  route: z.string(),
  instructions: z.string(),
  needs_review: z.boolean(),
});
export type MedicationItem = z.infer<typeof MedicationItemSchema>;

export const DischargeSummaryDataSchema = z.object({
  hospital_name: z.string(),
  admission_date: z.string(),
  discharge_date: z.string(),
  attending_physician: z.string(),
  reason_for_admission: z.string(),
  diagnoses_listed: z.array(z.string()),
  procedures: z.array(z.string()),
  follow_up_instructions: z.string(),
  patient_instructions: z.string(),
});
export type DischargeSummaryData = z.infer<typeof DischargeSummaryDataSchema>;

export const ExtractedMedicalDocumentSchema = z.object({
  document_type: DocumentTypeEnum,
  document_title: z.string(),
  provider: z.string(),
  report_date: z.string(),
  patient_name: z.string(),
  tests: z.array(LabTestItemSchema),
  medications: z.array(MedicationItemSchema),
  discharge_summary: DischargeSummaryDataSchema,
  extraction_status: ExtractionStatusEnum,
  review_notes: z.array(z.string()),
});
export type ExtractedMedicalDocument = z.infer<typeof ExtractedMedicalDocumentSchema>;

// Vault Record wrapper schema including system metadata and audit tracking
export const MedicalDocumentRecordSchema = z.object({
  id: z.string().uuid(),
  file_name: z.string(),
  file_size_bytes: z.number(),
  mime_type: z.string(),
  uploaded_at: z.string(),
  file_path: z.string(),
  extracted_data: ExtractedMedicalDocumentSchema,
  user_confirmed: z.boolean().default(false),
  confirmed_at: z.string().optional(),
  flagged_for_review: z.boolean().default(false),
  flag_reason: z.string().optional(),
});
export type MedicalDocumentRecord = z.infer<typeof MedicalDocumentRecordSchema>;
