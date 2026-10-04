import { Router } from 'express';
import {
  getDocumentsHandler,
  getDocumentByIdHandler,
  uploadDocumentHandler,
  confirmDocumentHandler,
  updateExtractedHandler,
  flagDocumentHandler,
} from '../controllers/documents.controller.js';
import { uploadDocumentMiddleware } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', getDocumentsHandler);
router.get('/:id', getDocumentByIdHandler);
router.post('/upload', uploadDocumentMiddleware.single('file'), uploadDocumentHandler);
router.patch('/:id/confirm', confirmDocumentHandler);
router.put('/:id/extracted', updateExtractedHandler);
router.post('/:id/flag', flagDocumentHandler);

export default router;
