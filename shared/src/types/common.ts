export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
    safeUserMessage: string;
  };
}

export type HealthSemanticStatus =
  | 'normal'
  | 'attention'
  | 'high'
  | 'high_priority'
  | 'emergency'
  | 'info';

export interface SemanticBadgeConfig {
  status: HealthSemanticStatus;
  label: string;
  iconName: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

export const DISCLAIMERS = {
  DOCUMENT_VAULT:
    'Extracted information helps organize your health records and may contain errors. Refer to the original medical document and consult a qualified healthcare professional for medical interpretation.',
  CLINICAL_TRIAGE:
    'HealthPulse provides preliminary health guidance and does not provide a medical diagnosis or replace a qualified healthcare professional. If you are experiencing a life-threatening medical emergency, seek immediate emergency medical care.',
  SECURITY_SAFEGUARD:
    'Health information is handled as sensitive data. Do not use this demonstration environment for real protected health information unless appropriate production security and compliance controls are configured.',
  EMERGENCY_PROMPT:
    'If you are experiencing severe chest pain, sudden numbness, difficulty breathing, or other life-threatening symptoms, get emergency help immediately.',
} as const;
