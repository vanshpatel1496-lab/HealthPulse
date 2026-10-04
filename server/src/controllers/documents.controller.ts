import { Request, Response, NextFunction } from 'express';
import {
  getAllDocuments,
  getDocumentById,
  saveNewDocument,
  confirmDocumentExtraction,
  updateExtractedData,
  flagDocumentError,
} from '../services/documentStorage.service.js';
import { extractMedicalDocument } from '../services/geminiExtractor.service.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

export async function getDocumentsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const documents = getAllDocuments();
    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDocumentByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const document = getDocumentById(id);
    if (!document) {
      throw new AppError('Medical document not found.', 404, 'The requested document could not be located in your vault.');
    }
    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadDocumentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) {
      throw new AppError('No document was uploaded.', 400, 'Please select a valid medical document to upload.');
    }

    // Call extraction service
    const extractedData = await extractMedicalDocument(
      file.path,
      file.mimetype,
      file.originalname
    );

    const record = saveNewDocument(file, extractedData);

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmDocumentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const confirmed = confirmDocumentExtraction(id);
    if (!confirmed) {
      throw new AppError('Document not found for confirmation.', 404);
    }
    res.json({
      success: true,
      data: confirmed,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExtractedHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updated = updateExtractedData(id, req.body);
    if (!updated) {
      throw new AppError('Document not found for update.', 404);
    }
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function flagDocumentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const flagged = flagDocumentError(id, reason || 'Flagged for patient review');
    if (!flagged) {
      throw new AppError('Document not found for flagging.', 404);
    }
    res.json({
      success: true,
      data: flagged,
    });
  } catch (error) {
    next(error);
  }
}
