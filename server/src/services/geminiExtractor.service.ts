import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ExtractedMedicalDocument, ExtractedMedicalDocumentSchema } from '@healthpulse/shared';
import { geminiClient } from '../config/gemini.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read canonical AI Studio instructions and schema
const SYSTEM_PROMPT_PATH = path.resolve(__dirname, '../../../AI_STUDIO/medical_extractor_system_prompt.md');
const SCHEMA_PATH = path.resolve(__dirname, '../../../AI_STUDIO/medical_extractor_schema.json');

export const extractorSystemPrompt = fs.existsSync(SYSTEM_PROMPT_PATH)
  ? fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8')
  : 'You are the HealthPulse Medical Document Extraction Engine.';

export const extractorJsonSchema = fs.existsSync(SCHEMA_PATH)
  ? JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'))
  : null;

/**
 * Service placeholder for extracting structured data from uploaded medical documents.
 * In development without GEMINI_API_KEY, provides a verified mock extraction for initial testing.
 * In production, requires Gemini API key and surfaces explicit safe errors if API fails.
 */
export async function extractMedicalDocument(
  filePath: string,
  mimeType: string,
  originalName: string
): Promise<ExtractedMedicalDocument> {
  // Clinical safety safeguard: Must not mock in production
  if (!geminiClient || !env.GEMINI_LIVE_CALLS_ENABLED) {
    if (env.NODE_ENV === 'production') {
      throw new AppError(
        'Gemini Extraction Engine is not enabled or configured in production.',
        503,
        'Medical document extraction is temporarily unavailable. Please try again later.'
      );
    }

    console.warn(
      `[DEV MODE] GEMINI_LIVE_CALLS_ENABLED is false or key missing. Using clinical verification mock for: ${originalName}`
    );
    return generateDevMockExtraction(originalName);
  }

  try {
    const fileBytes = fs.readFileSync(filePath);
    const base64Data = fileBytes.toString('base64');

    const response = await geminiClient.models.generateContent({
      model: 'models/gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType,
              },
            },
            {
              text: `Extract structured information from this medical document following the exact configured schema. Document filename: ${originalName}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: extractorSystemPrompt,
        responseMimeType: 'application/json',
        responseSchema: extractorJsonSchema,
        maxOutputTokens: 65536,
        temperature: 0.1,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Gemini API returned an empty extraction response.');
    }

    const parsedJson = JSON.parse(outputText);
    return ExtractedMedicalDocumentSchema.parse(parsedJson);
  } catch (error: unknown) {
    console.error('Error during Gemini document extraction:', error);
    const errorMsg = error instanceof Error ? error.message : 'Unknown extraction failure';
    const isQuotaOrUnavailable = /quota|429|resource_exhausted|unavailable|503/i.test(errorMsg);

    // Clinical safety invariant: Never silently mock in production when API call fails
    throw new AppError(
      `Document extraction failed: ${errorMsg}`,
      isQuotaOrUnavailable ? 503 : 502,
      'Unable to extract information from this document at this time. Please verify the document is legible or try again later.'
    );
  }
}

/**
 * High-fidelity clinical mock extraction for development and local testing.
 */
function generateDevMockExtraction(filename: string): ExtractedMedicalDocument {
  const isPrescription = /prescription|rx|med/i.test(filename);
  const isDischarge = /discharge|summary|hospital/i.test(filename);

  if (isPrescription) {
    return {
      document_type: 'prescription',
      document_title: 'Outpatient Prescription Order',
      provider: 'MetroHealth Family Medicine — Dr. Aris Mehta, MD (NPI: 1849203847)',
      report_date: '2026-09-24',
      patient_name: 'Elena Rostova',
      tests: [],
      medications: [
        {
          medication_name: 'Amoxicillin',
          strength: '500 mg',
          form: 'Capsule',
          dose: '1 capsule',
          frequency: 'Every 8 hours with food',
          duration: '10 days',
          route: 'Oral',
          instructions: 'Take one capsule three times daily by mouth for 10 days until finished. Take with a meal.',
          needs_review: false,
        },
      ],
      discharge_summary: {
        hospital_name: '',
        admission_date: '',
        discharge_date: '',
        attending_physician: '',
        reason_for_admission: '',
        diagnoses_listed: [],
        procedures: [],
        follow_up_instructions: '',
        patient_instructions: '',
      },
      extraction_status: 'success',
      review_notes: ['Prescription parsed with 1 active medication item.'],
    };
  }

  if (isDischarge) {
    return {
      document_type: 'discharge_summary',
      document_title: 'Clinical Discharge Summary',
      provider: 'St. Jude Medical Group — Department of Internal Medicine',
      report_date: '2026-09-18',
      patient_name: 'Elena Rostova',
      tests: [],
      medications: [
        {
          medication_name: 'Lisinopril',
          strength: '10 mg',
          form: 'Tablet',
          dose: '1 tablet',
          frequency: 'Once daily in the morning',
          duration: 'Ongoing',
          route: 'Oral',
          instructions: 'Continue routine blood pressure maintenance.',
          needs_review: false,
        },
      ],
      discharge_summary: {
        hospital_name: 'St. Jude Medical Center',
        admission_date: '2026-09-16',
        discharge_date: '2026-09-18',
        attending_physician: 'Dr. Sarah Lin, MD',
        reason_for_admission: 'Acute moderate migraine with light sensitivity',
        diagnoses_listed: ['Acute migraine with aura, resolved', 'Mild dehydration'],
        procedures: ['Neurological physical exam', 'Non-contrast head CT (Normal)'],
        follow_up_instructions: 'Follow up with primary care physician within 10 days if symptoms recur.',
        patient_instructions: 'Maintain adequate hydration and rest. Avoid bright screen exposure.',
      },
      extraction_status: 'success',
      review_notes: ['Discharge summary parsed with physician instructions and listed diagnoses.'],
    };
  }

  // Default: Comprehensive Laboratory Panel (CBC)
  return {
    document_type: 'lab_report',
    document_title: 'Complete Blood Count (CBC) with Differential',
    provider: 'Quest Diagnostics Regional Clinical Laboratory',
    report_date: '2026-09-22',
    patient_name: 'Elena Rostova',
    tests: [
      {
        test_name: 'White Blood Cell Count (WBC)',
        value: '6.8',
        unit: 'x10E3/uL',
        reference_range: '4.5 - 11.0',
        flag: 'normal',
        needs_review: false,
      },
      {
        test_name: 'Red Blood Cell Count (RBC)',
        value: '4.62',
        unit: 'x10E6/uL',
        reference_range: '4.20 - 5.40',
        flag: 'normal',
        needs_review: false,
      },
      {
        test_name: 'Hemoglobin',
        value: '14.2',
        unit: 'g/dL',
        reference_range: '12.0 - 16.0',
        flag: 'normal',
        needs_review: false,
      },
      {
        test_name: 'Hematocrit',
        value: '42.1',
        unit: '%',
        reference_range: '37.0 - 48.0',
        flag: 'normal',
        needs_review: false,
      },
      {
        test_name: 'Platelets',
        value: '265',
        unit: 'x10E3/uL',
        reference_range: '150 - 450',
        flag: 'normal',
        needs_review: false,
      },
      {
        test_name: 'Fasting Blood Glucose',
        value: '92',
        unit: 'mg/dL',
        reference_range: '70 - 99',
        flag: 'normal',
        needs_review: false,
      },
    ],
    medications: [],
    discharge_summary: {
      hospital_name: '',
      admission_date: '',
      discharge_date: '',
      attending_physician: '',
      reason_for_admission: '',
      diagnoses_listed: [],
      procedures: [],
      follow_up_instructions: '',
      patient_instructions: '',
    },
    extraction_status: 'success',
    review_notes: ['Laboratory hematology panel extracted with 6 baseline tests.'],
  };
}
