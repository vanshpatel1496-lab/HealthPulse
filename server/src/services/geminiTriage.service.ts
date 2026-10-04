import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  TriageEvaluationResult,
  TriageEvaluationResultSchema,
  TriageSession,
} from '@healthpulse/shared';
import { geminiClient } from '../config/gemini.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYSTEM_PROMPT_PATH = path.resolve(__dirname, '../../../AI_STUDIO/triage_system_prompt.md');
const SCHEMA_PATH = path.resolve(__dirname, '../../../AI_STUDIO/triage_schema.json');

export const triageSystemPrompt = fs.existsSync(SYSTEM_PROMPT_PATH)
  ? fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8')
  : 'You are the HealthPulse Triage & Insight Engine.';

export const triageJsonSchema = fs.existsSync(SCHEMA_PATH)
  ? JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'))
  : null;

/**
 * Evaluates patient symptoms and intake summary to provide non-diagnostic preliminary triage guidance.
 */
export async function evaluateTriageSession(
  session: TriageSession
): Promise<TriageEvaluationResult> {
  if (!geminiClient || !env.GEMINI_LIVE_CALLS_ENABLED) {
    if (env.NODE_ENV === 'production') {
      throw new AppError(
        'Gemini Triage Engine is not enabled or configured in production.',
        503,
        'Symptom triage guidance is temporarily unavailable. If you are experiencing severe symptoms, please seek immediate emergency medical care.'
      );
    }

    console.warn(
      `[DEV MODE] GEMINI_LIVE_CALLS_ENABLED is false or key missing. Using clinical verification mock for session: ${session.session_id}`
    );
    return generateDevMockTriage(session);
  }

  try {
    const conversationTranscript = session.messages
      .map((m) => `${m.sender.toUpperCase()}: ${m.content}`)
      .join('\n');

    const promptInput = `Evaluate the following reported symptoms and conversation intake to provide preliminary triage guidance following the required schema:

STRUCTURED INTAKE DATA:
- Main Symptom: ${session.intake_summary.main_symptom || 'Not specified'}
- Onset/Started: ${session.intake_summary.started || 'Not specified'}
- Reported Severity: ${session.intake_summary.severity_tier}
- Associated Symptoms: ${session.intake_summary.associated_symptoms.join(', ') || 'None reported'}
- Progression: ${session.intake_summary.progression || 'Stable'}
- Additional Context: ${session.intake_summary.context || 'None'}

CONVERSATION TRANSCRIPT:
${conversationTranscript}
`;

    const response = await geminiClient.models.generateContent({
      model: 'models/gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: promptInput }] }],
      config: {
        systemInstruction: triageSystemPrompt,
        responseMimeType: 'application/json',
        responseSchema: triageJsonSchema,
        maxOutputTokens: 65536,
        temperature: 0.2,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Gemini API returned an empty triage evaluation.');
    }

    const parsedJson = JSON.parse(outputText);
    return TriageEvaluationResultSchema.parse(parsedJson);
  } catch (error: unknown) {
    console.error('Error during Gemini triage evaluation:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown triage failure';
    const isQuotaOrUnavailable = /quota|429|resource_exhausted|unavailable|503/i.test(errorMsg);

    throw new AppError(
      `Triage evaluation failed: ${errorMsg}`,
      isQuotaOrUnavailable ? 503 : 502,
      'Unable to evaluate symptoms at this time. If your symptoms are severe or worsening, please consult a healthcare professional or seek immediate emergency medical care.'
    );
  }
}

/**
 * Dev-mode mock evaluation adhering strictly to non-diagnostic observational language.
 */
function generateDevMockTriage(session: TriageSession): TriageEvaluationResult {
  const allText = [
    session.intake_summary.main_symptom,
    ...session.intake_summary.associated_symptoms,
    ...session.messages.map((m) => m.content),
  ].join(' ');

  const isEmergency = /chest pain|cannot breathe|dyspnea|stroke|thunderclap|paralysis|heart attack|crushing|anaphylaxis|unconscious/i.test(
    allText
  );

  const isLow =
    session.intake_summary.severity_tier === 'mild' ||
    /mild|minor|slight|sniffle|tired|scratch|occasional/i.test(allText);

  const isHigh =
    session.intake_summary.severity_tier === 'severe' ||
    /worsening|high fever|fever over 102|severe dizziness/i.test(allText);

  const baseDisclaimer =
    'HealthPulse provides preliminary health guidance and does not provide a medical diagnosis or replace a qualified healthcare professional. If you are experiencing a life-threatening medical emergency, seek immediate emergency medical care.';

  if (isEmergency) {
    return {
      urgency: 'emergency',
      information_complete: true,
      missing_information: [],
      reported_symptoms: [
        session.intake_summary.main_symptom || 'Acute severe chest discomfort',
        ...session.intake_summary.associated_symptoms,
      ],
      duration: session.intake_summary.started || 'Acute onset within the past hour',
      severity: 'severe',
      associated_symptoms: session.intake_summary.associated_symptoms,
      key_observations: [
        'You reported acute symptoms that include high-risk warning characteristics.',
        'Based on the information provided, immediate clinical evaluation is strongly warranted.',
      ],
      suggested_next_step:
        'Seek immediate emergency medical care or contact your local emergency services.',
      warning_signs: [
        'Sudden severe chest pressure, radiating pain to arm or jaw, or severe shortness of breath.',
        'Sudden weakness, facial drooping, or difficulty speaking.',
      ],
      emergency_action_required: true,
      disclaimer: baseDisclaimer,
    };
  }

  if (isLow) {
    return {
      urgency: 'low',
      information_complete: true,
      missing_information: [],
      reported_symptoms: [
        session.intake_summary.main_symptom || 'Mild occasional fatigue and minor nasal congestion',
        ...session.intake_summary.associated_symptoms,
      ],
      duration: session.intake_summary.started || '3 days',
      severity: 'mild',
      associated_symptoms: session.intake_summary.associated_symptoms,
      key_observations: [
        'You reported mild symptoms without acute red-flag characteristics.',
        'Based on the information provided, symptoms appear mild and stable at this time.',
      ],
      suggested_next_step:
        'Consider monitoring your symptoms at home and consult a healthcare professional if they persist or worsen over the next several days.',
      warning_signs: [
        'Seek medical evaluation if you develop high fever, difficulty breathing, or sudden severe symptoms.',
      ],
      emergency_action_required: false,
      disclaimer: baseDisclaimer,
    };
  }

  if (isHigh) {
    return {
      urgency: 'high',
      information_complete: true,
      missing_information: [],
      reported_symptoms: [
        session.intake_summary.main_symptom || 'Persistent high fever with progressive fatigue',
        ...session.intake_summary.associated_symptoms,
      ],
      duration: session.intake_summary.started || '24 hours',
      severity: 'severe',
      associated_symptoms: session.intake_summary.associated_symptoms,
      key_observations: [
        'You reported significant symptoms that are progressive in nature.',
        'Based on the information provided, timely medical evaluation within 12 to 24 hours is recommended.',
      ],
      suggested_next_step:
        'Consider contacting an urgent care provider or your primary healthcare provider today for evaluation.',
      warning_signs: [
        'Seek immediate emergency medical care if you develop confusion, breathing difficulty, or inability to keep fluids down.',
      ],
      emergency_action_required: false,
      disclaimer: baseDisclaimer,
    };
  }

  // Default Medium Urgency
  return {
    urgency: 'medium',
    information_complete: true,
    missing_information: [],
    reported_symptoms: [
      session.intake_summary.main_symptom || 'Frontal headache with mild ocular fatigue',
      ...session.intake_summary.associated_symptoms,
    ],
    duration: session.intake_summary.started || '4 hours ago',
    severity: session.intake_summary.severity_tier === 'unknown' ? 'moderate' : session.intake_summary.severity_tier,
    associated_symptoms: session.intake_summary.associated_symptoms.length > 0
      ? session.intake_summary.associated_symptoms
      : ['Mild sensitivity to screen light'],
    key_observations: [
      'You reported a moderate frontal headache that started approximately 4 hours ago.',
      'You noted mild screen light sensitivity without fever or focal neurological signs.',
    ],
    suggested_next_step:
      'Consider contacting a healthcare professional, especially if symptoms continue or worsen over the next 24 to 48 hours.',
    warning_signs: [
      'Seek immediate emergency medical care if you develop sudden thunderclap severity, stiff neck, high fever, or vision changes.',
    ],
    emergency_action_required: false,
    disclaimer: baseDisclaimer,
  };
}
