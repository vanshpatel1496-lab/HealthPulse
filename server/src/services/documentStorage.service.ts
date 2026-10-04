import { MedicalDocumentRecord, ExtractedMedicalDocument } from '@healthpulse/shared';
import { v4 as uuidv4 } from 'uuid';

// In-memory document storage initialized with demo clinical records
const documentsStore = new Map<string, MedicalDocumentRecord>();

// Pre-seed demo documents
const demoLabRecord: MedicalDocumentRecord = {
  id: 'doc_demo_cbc_01',
  file_name: 'quest_diagnostics_cbc_panel.pdf',
  file_size_bytes: 482910,
  mime_type: 'application/pdf',
  uploaded_at: '2026-09-22T09:14:00Z',
  file_path: '/uploads/quest_diagnostics_cbc_panel.pdf',
  user_confirmed: true,
  confirmed_at: '2026-09-22T09:18:22Z',
  flagged_for_review: false,
  extracted_data: {
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
    review_notes: ['Full hematology panel verified against Quest reference values.'],
  },
};

const demoPrescriptionRecord: MedicalDocumentRecord = {
  id: 'doc_demo_rx_02',
  file_name: 'metrohealth_amoxicillin_rx.pdf',
  file_size_bytes: 312450,
  mime_type: 'application/pdf',
  uploaded_at: '2026-09-24T14:30:00Z',
  file_path: '/uploads/metrohealth_amoxicillin_rx.pdf',
  user_confirmed: false,
  flagged_for_review: false,
  extracted_data: {
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
        frequency: 'Every 8 hours with meals',
        duration: '10 days',
        route: 'Oral',
        instructions: 'Take 1 capsule by mouth three times daily for 10 days until finished. Take with food.',
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
    extraction_status: 'needs_review',
    review_notes: ['New prescription pending patient confirmation of pharmacy instructions.'],
  },
};

documentsStore.set(demoLabRecord.id, demoLabRecord);
documentsStore.set(demoPrescriptionRecord.id, demoPrescriptionRecord);

export function getAllDocuments(): MedicalDocumentRecord[] {
  return Array.from(documentsStore.values()).sort(
    (a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  );
}

export function getDocumentById(id: string): MedicalDocumentRecord | undefined {
  return documentsStore.get(id);
}

export function saveNewDocument(
  file: Express.Multer.File,
  extractedData: ExtractedMedicalDocument
): MedicalDocumentRecord {
  const record: MedicalDocumentRecord = {
    id: uuidv4(),
    file_name: file.originalname,
    file_size_bytes: file.size,
    mime_type: file.mimetype,
    uploaded_at: new Date().toISOString(),
    file_path: `/uploads/${file.filename}`,
    extracted_data: extractedData,
    user_confirmed: false,
    flagged_for_review: extractedData.extraction_status === 'needs_review',
  };

  documentsStore.set(record.id, record);
  return record;
}

export function confirmDocumentExtraction(id: string): MedicalDocumentRecord | undefined {
  const doc = documentsStore.get(id);
  if (!doc) return undefined;

  doc.user_confirmed = true;
  doc.confirmed_at = new Date().toISOString();
  doc.flagged_for_review = false;
  documentsStore.set(id, doc);
  return doc;
}

export function updateExtractedData(
  id: string,
  updatedData: ExtractedMedicalDocument
): MedicalDocumentRecord | undefined {
  const doc = documentsStore.get(id);
  if (!doc) return undefined;

  doc.extracted_data = updatedData;
  documentsStore.set(id, doc);
  return doc;
}

export function flagDocumentError(id: string, reason: string): MedicalDocumentRecord | undefined {
  const doc = documentsStore.get(id);
  if (!doc) return undefined;

  doc.flagged_for_review = true;
  doc.flag_reason = reason;
  documentsStore.set(id, doc);
  return doc;
}
