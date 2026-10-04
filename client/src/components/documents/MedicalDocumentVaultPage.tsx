import React, { useState, useEffect } from 'react';
import { Upload, FileText, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { DocumentUploadZone } from './DocumentUploadZone';
import { DocumentSplitViewer } from './DocumentSplitViewer';
import { fetchDocuments } from '../../services/documents.service';
import { MedicalDocumentRecord } from '@healthpulse/shared';

export const MedicalDocumentVaultPage: React.FC = () => {
  const [documents, setDocuments] = useState<MedicalDocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'lab_report' | 'prescription' | 'discharge_summary'>('all');
  const [activeViewingDoc, setActiveViewingDoc] = useState<MedicalDocumentRecord | null>(null);
  const [showUploadZone, setShowUploadZone] = useState<boolean>(true);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve documents.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUploadSuccess = (newDoc: MedicalDocumentRecord) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveViewingDoc(newDoc); // Automatically open split view on newly uploaded doc
  };

  const handleDocumentUpdated = (updated: MedicalDocumentRecord) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === updated.id ? updated : doc))
    );
    if (activeViewingDoc?.id === updated.id) {
      setActiveViewingDoc(updated);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (selectedFilter === 'all') return true;
    return doc.extracted_data.document_type === selectedFilter;
  });

  const filterTabs = [
    { key: 'all', label: `All Records (${documents.length})` },
    {
      key: 'lab_report',
      label: `Lab Reports (${documents.filter((d) => d.extracted_data.document_type === 'lab_report').length})`,
    },
    {
      key: 'prescription',
      label: `Prescriptions (${documents.filter((d) => d.extracted_data.document_type === 'prescription').length})`,
    },
    {
      key: 'discharge_summary',
      label: `Discharge Summaries (${documents.filter((d) => d.extracted_data.document_type === 'discharge_summary').length})`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Medical Document Vault
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Secure optical extraction and structured review hub
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            onClick={loadDocuments}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => setShowUploadZone((prev) => !prev)}
          >
            {showUploadZone ? 'Hide Uploader' : 'Upload New Record'}
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      {showUploadZone && (
        <DocumentUploadZone onUploadSuccess={handleUploadSuccess} />
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key as typeof selectedFilter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
              selectedFilter === tab.key
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={loadDocuments}>
            Retry
          </Button>
        </div>
      )}

      {/* Document Records Grid */}
      {isLoading && documents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading medical documents from vault...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No records found</h3>
          <p className="text-xs text-slate-400 mt-1">
            No medical documents match the selected filter category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isConfirmed = doc.user_confirmed;
            const isFlagged = doc.flagged_for_review;
            const testCount = doc.extracted_data.tests?.length || 0;
            const medCount = doc.extracted_data.medications?.length || 0;

            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-clinical-card flex flex-col justify-between hover:border-teal-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 leading-tight">
                          {doc.extracted_data.document_title || doc.file_name}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {doc.extracted_data.provider || 'Clinical Provider'} • {doc.extracted_data.report_date || 'Recent'}
                        </p>
                      </div>
                    </div>

                    {isConfirmed ? (
                      <StatusBadge status="normal" label="Confirmed" size="sm" />
                    ) : isFlagged ? (
                      <StatusBadge status="attention" label="Needs Review" size="sm" />
                    ) : (
                      <StatusBadge status="info" label="Unverified" size="sm" />
                    )}
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    {testCount > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Extracted Lab Tests:</span>
                        <span className="font-semibold text-slate-900">
                          {testCount} Values ({doc.extracted_data.tests.map((t) => t.test_name.split(' ')[0]).slice(0, 4).join(', ')})
                        </span>
                      </div>
                    )}

                    {medCount > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Extracted Medication:</span>
                        <span className="font-semibold text-slate-900">
                          {doc.extracted_data.medications[0].medication_name}{' '}
                          {doc.extracted_data.medications[0].strength}
                        </span>
                      </div>
                    )}

                    {doc.extracted_data.discharge_summary?.hospital_name && (
                      <div className="flex justify-between text-slate-600">
                        <span>Hospital:</span>
                        <span className="font-semibold text-slate-900">
                          {doc.extracted_data.discharge_summary.hospital_name}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Status:</span>
                      <span className="font-medium text-teal-800">
                        {isConfirmed ? 'Verified in Vault' : 'Pending Patient Confirmation'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {doc.mime_type.includes('pdf') ? 'PDF' : 'IMAGE'} • {Math.round(doc.file_size_bytes / 1024)} KB
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setActiveViewingDoc(doc)}
                  >
                    Split-View Review
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Split-View Modal */}
      {activeViewingDoc && (
        <DocumentSplitViewer
          document={activeViewingDoc}
          onClose={() => setActiveViewingDoc(null)}
          onDocumentUpdated={handleDocumentUpdated}
        />
      )}

      {/* Healthcare Disclaimer */}
      <DisclaimerBanner type="document" />
    </div>
  );
};
