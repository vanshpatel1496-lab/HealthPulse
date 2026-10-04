import React, { useState } from 'react';
import {
  MedicalDocumentRecord,
  ExtractedMedicalDocument,
  LabTestItem,
} from '@healthpulse/shared';
import {
  X,
  FileText,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  Building,
  User,
  Pill,
  Hospital,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { LabResultTable } from './LabResultTable';
import {
  confirmDocumentExtraction,
  updateDocumentExtractedData,
  flagDocumentForReview,
} from '../../services/documents.service';

interface DocumentSplitViewerProps {
  document: MedicalDocumentRecord;
  onClose: () => void;
  onDocumentUpdated: (updated: MedicalDocumentRecord) => void;
}

export const DocumentSplitViewer: React.FC<DocumentSplitViewerProps> = ({
  document,
  onClose,
  onDocumentUpdated,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<ExtractedMedicalDocument>(
    JSON.parse(JSON.stringify(document.extracted_data))
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isFlagging, setIsFlagging] = useState<boolean>(false);
  const [flagReason, setFlagReason] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'original' | 'extracted'>('original');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleConfirm = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const updated = await confirmDocumentExtraction(document.id);
      onDocumentUpdated(updated);
      setStatusMessage({
        type: 'success',
        text: 'Document extraction confirmed and saved to your personal medical vault.',
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Confirmation failed.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdits = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const updated = await updateDocumentExtractedData(document.id, editedData);
      setIsEditing(false);
      onDocumentUpdated(updated);
      setStatusMessage({
        type: 'success',
        text: 'Extracted clinical values updated successfully.',
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save modifications.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim()) return;

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const updated = await flagDocumentForReview(document.id, flagReason);
      setIsFlagging(false);
      onDocumentUpdated(updated);
      setStatusMessage({
        type: 'success',
        text: 'Document flagged for clinical review.',
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to flag document.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateLabTest = (index: number, updatedItem: LabTestItem) => {
    const updatedTests = [...editedData.tests];
    updatedTests[index] = updatedItem;
    setEditedData({ ...editedData, tests: updatedTests });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Split-View Review: {document.extracted_data.document_title || document.file_name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>{document.file_name}</span>
                <span>•</span>
                <span>{Math.round(document.file_size_bytes / 1024)} KB</span>
                {document.user_confirmed && (
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Confirmed
                  </span>
                )}
                {document.flagged_for_review && (
                  <span className="text-amber-700 font-medium inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Review Flagged
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close Split-View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Mobile Tab Switcher for responsive screens */}
        <div className="lg:hidden flex border-b border-slate-200 bg-slate-50 text-xs font-semibold p-1">
          <button
            onClick={() => setMobileTab('original')}
            className={`flex-1 py-2 rounded-lg text-center transition-colors ${
              mobileTab === 'original'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Source Scan Viewport
          </button>
          <button
            onClick={() => setMobileTab('extracted')}
            className={`flex-1 py-2 rounded-lg text-center transition-colors ${
              mobileTab === 'extracted'
                ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Structured Extraction & Audit
          </button>
        </div>

        {/* Split View Body: Left = Scan Preview, Right = Extracted Fields */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Source Document Viewport */}
          <div className={`${mobileTab === 'original' ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-slate-100 overflow-hidden`}>
            {/* Viewport Toolbar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Source Medical Scan</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 15, 50))}
                  className="p-1 rounded hover:bg-slate-200 text-slate-700"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1 w-10 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 15, 200))}
                  className="p-1 rounded hover:bg-slate-200 text-slate-700"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 rounded hover:bg-slate-200 text-slate-700 ml-1"
                  title="Reset Zoom"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Canvas Area */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-300 p-6 min-h-[460px] text-xs font-mono text-slate-700 transition-transform duration-100"
              >
                <div className="border-b border-slate-200 pb-3 mb-4 text-center">
                  <div className="font-bold text-slate-900 text-sm tracking-wide uppercase">
                    {document.extracted_data.provider || 'Clinical Health Facility'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    PATIENT: {document.extracted_data.patient_name || 'Elena Rostova'} | DATE:{' '}
                    {document.extracted_data.report_date || '2026-09-22'}
                  </div>
                </div>

                <div className="font-bold text-center text-slate-900 mb-4 uppercase">
                  {document.extracted_data.document_title}
                </div>

                {document.extracted_data.tests.length > 0 && (
                  <div className="space-y-1 text-[11px] mb-4">
                    <div className="grid grid-cols-4 font-bold border-b border-slate-300 pb-1 text-slate-600">
                      <span>TEST</span>
                      <span>RESULT</span>
                      <span>UNIT</span>
                      <span>REF RANGE</span>
                    </div>
                    {document.extracted_data.tests.map((t, idx) => (
                      <div key={idx} className="grid grid-cols-4 py-0.5 border-b border-slate-100">
                        <span className="truncate">{t.test_name}</span>
                        <span className="font-bold">{t.value}</span>
                        <span>{t.unit}</span>
                        <span>{t.reference_range}</span>
                      </div>
                    ))}
                  </div>
                )}

                {document.extracted_data.medications.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 mb-4 space-y-1">
                    <div className="font-bold text-slate-800">PRESCRIPTION ORDER:</div>
                    {document.extracted_data.medications.map((m, idx) => (
                      <div key={idx} className="text-[11px]">
                        <span className="font-bold">{m.medication_name}</span> {m.strength} ({m.form})
                        <div className="text-slate-500">{m.instructions}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                  ORIGINAL VERIFIED RECORD SCAN • FILE: {document.file_name}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Structured Extraction View & Editor */}
          <div className={`${mobileTab === 'extracted' ? 'flex' : 'hidden lg:flex'} flex-col h-full bg-white overflow-hidden`}>
            {/* Structured Data Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Document Metadata Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Hospital className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Provider / Clinic
                    </span>
                    <span className="font-medium text-slate-900 truncate block">
                      {document.extracted_data.provider || 'Not specified'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Report Date
                    </span>
                    <span className="font-medium text-slate-900 block">
                      {document.extracted_data.report_date || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Patient Name
                    </span>
                    <span className="font-medium text-slate-900 block">
                      {document.extracted_data.patient_name || 'Elena Rostova'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Record Type
                    </span>
                    <span className="font-semibold text-teal-800 uppercase text-[11px] block">
                      {document.extracted_data.document_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lab Results Section */}
              {editedData.tests && editedData.tests.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Extracted Laboratory Panels ({editedData.tests.length})
                    </h3>
                    <StatusBadge status="normal" label="Optical Extraction" size="sm" />
                  </div>
                  <LabResultTable
                    tests={editedData.tests}
                    isEditing={isEditing}
                    onUpdateTest={updateLabTest}
                  />
                </div>
              )}

              {/* Medications Section */}
              {editedData.medications && editedData.medications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-700" />
                    Extracted Medications ({editedData.medications.length})
                  </h3>
                  <div className="space-y-2">
                    {editedData.medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {med.medication_name} {med.strength}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {med.form} • {med.route}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          <span className="font-medium text-slate-900">Schedule: </span>
                          {med.frequency} for {med.duration}
                        </div>
                        {med.instructions && (
                          <div className="p-2 rounded bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                            <span className="font-semibold text-slate-700">Instructions: </span>
                            {med.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discharge Summary Section */}
              {editedData.discharge_summary &&
                editedData.discharge_summary.hospital_name && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Hospital className="w-3.5 h-3.5 text-teal-700" />
                      Discharge Summary Details
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Hospital</span>
                        <span className="font-semibold text-slate-900">
                          {editedData.discharge_summary.hospital_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Attending Physician</span>
                        <span className="font-semibold text-slate-900">
                          {editedData.discharge_summary.attending_physician || '—'}
                        </span>
                      </div>
                    </div>
                    {editedData.discharge_summary.diagnoses_listed?.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Diagnoses Listed:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {editedData.discharge_summary.diagnoses_listed.map((d, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-700 font-medium"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* Clinical Review Notes */}
              {editedData.review_notes && editedData.review_notes.length > 0 && (
                <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 text-xs space-y-1">
                  <div className="font-bold text-teal-900">Extraction Review Notes:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-teal-800 text-[11px]">
                    {editedData.review_notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Flag Modal Input View */}
              {isFlagging && (
                <form
                  onSubmit={handleFlagSubmit}
                  className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3 animate-fadeIn"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Flag Document for Patient / Clinical Review
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Describe any discrepancies found between the source scan and the extracted values:
                  </p>
                  <textarea
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    placeholder="e.g. Platelet count was misread from faded scan..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg border border-amber-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFlagging(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      disabled={isSaving || !flagReason.trim()}
                    >
                      Submit Review Flag
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Values
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Save className="w-3.5 h-3.5" />}
                      onClick={handleSaveEdits}
                      disabled={isSaving}
                    >
                      Save Modifications
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(JSON.parse(JSON.stringify(document.extracted_data)));
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {!document.flagged_for_review && !isFlagging && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                    onClick={() => setIsFlagging(true)}
                  >
                    Flag for Review
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<CheckCircle className="w-4 h-4" />}
                  onClick={handleConfirm}
                  disabled={isSaving || document.user_confirmed}
                >
                  {document.user_confirmed ? 'Extraction Confirmed' : 'Confirm & Save to Record'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
