import { z } from 'zod';

export const UrgencyLevelEnum = z.enum([
  'low',
  'medium',
  'high',
  'emergency',
]);
export type UrgencyLevel = z.infer<typeof UrgencyLevelEnum>;

export const SymptomSeverityEnum = z.enum([
  'mild',
  'moderate',
  'severe',
  'unknown',
]);
export type SymptomSeverity = z.infer<typeof SymptomSeverityEnum>;

export const SessionStatusEnum = z.enum([
  'in_progress',
  'completed',
  'incomplete',
]);
export type SessionStatus = z.infer<typeof SessionStatusEnum>;

// Exact representation of AI Studio Triage & Insight Engine Json schema
export const TriageEvaluationResultSchema = z.object({
  urgency: UrgencyLevelEnum,
  information_complete: z.boolean(),
  missing_information: z.array(z.string()),
  reported_symptoms: z.array(z.string()),
  duration: z.string(),
  severity: SymptomSeverityEnum,
  associated_symptoms: z.array(z.string()),
  key_observations: z.array(z.string()),
  suggested_next_step: z.string(),
  warning_signs: z.array(z.string()),
  emergency_action_required: z.boolean(),
  disclaimer: z.string(),
});
export type TriageEvaluationResult = z.infer<typeof TriageEvaluationResultSchema>;

export const TriageMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(['patient', 'assistant']),
  content: z.string(),
  timestamp: z.string(),
});
export type TriageMessage = z.infer<typeof TriageMessageSchema>;

export const StructuredIntakeSummarySchema = z.object({
  main_symptom: z.string().default(''),
  started: z.string().default(''),
  severity_tier: SymptomSeverityEnum.default('unknown'),
  associated_symptoms: z.array(z.string()).default([]),
  progression: z.string().default(''),
  context: z.string().default(''),
});
export type StructuredIntakeSummary = z.infer<typeof StructuredIntakeSummarySchema>;

export const TriageSessionSchema = z.object({
  session_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  session_status: SessionStatusEnum,
  messages: z.array(TriageMessageSchema),
  intake_summary: StructuredIntakeSummarySchema,
  evaluation: TriageEvaluationResultSchema.optional(),
});
export type TriageSession = z.infer<typeof TriageSessionSchema>;

export const CreateTriageSessionRequestSchema = z.object({
  initial_symptom: z.string().optional(),
});
export type CreateTriageSessionRequest = z.infer<typeof CreateTriageSessionRequestSchema>;

export const SendTriageMessageRequestSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  updated_intake: StructuredIntakeSummarySchema.optional(),
});
export type SendTriageMessageRequest = z.infer<typeof SendTriageMessageRequestSchema>;
