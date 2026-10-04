import React, { useState, useRef } from 'react';
import { Upload, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadDocumentFile } from '../../services/documents.service';
import { MedicalDocumentRecord } from '@healthpulse/shared';

interface DocumentUploadZoneProps {
  onUploadSuccess: (record: MedicalDocumentRecord) => void;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate size (25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage('File size exceeds the 25MB limit. Please upload a smaller medical document.');
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload a PDF, JPEG, PNG, or WebP medical scan.');
      return;
    }

    setIsUploading(true);
    try {
      const record = await uploadDocumentFile(file);
      setSuccessMessage(`"${file.name}" uploaded and structured clinical data extracted successfully.`);
      onUploadSuccess(record);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`p-7 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
          isDragging
            ? 'border-teal-600 bg-teal-50/40 ring-4 ring-teal-50'
            : 'border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/20'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload medical document scan"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 mx-auto mb-3">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-teal-700" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        {isUploading ? (
          <div>
            <h2 className="text-sm font-semibold text-teal-900">
              Processing & Extracting Clinical Data...
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Analyzing test panels, medications, and clinical reference ranges
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Drop your medical document scan here, or <span className="text-teal-700 underline font-bold">browse</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Supports authentic PDF, JPG, PNG, and WebP medical records up to 25MB
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-teal-600" />
          <span>Medical records processed securely for structured organization</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Extraction Notice: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Success: </span>
            {successMessage}
          </div>
        </div>
      )}
    </div>
  );
};
