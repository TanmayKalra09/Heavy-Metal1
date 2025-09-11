import express from 'express';
import {
    uploadAndProcessFile,
    getAllAnalyses,
    getAnalysisById,
    deleteAnalysis,
} from '../../controllers/data.controller.js';
import { protect } from '../../middlewares/auth.js';
import { upload } from '../../middlewares/fileUpload.js';

const router = express.Router();

// --- All routes in this file are protected and require a valid token ---
// The 'protect' middleware is applied to all routes starting with /api/data in app.js

// Route to handle file upload and processing
// The 'upload' middleware processes the file before it hits the controller
router.post('/upload', upload, uploadAndProcessFile);

// Routes for managing analysis records
router.route('/')
    .get(getAllAnalyses); // Get all analyses for the logged-in user

router.route('/:id')
    .get(getAnalysisById)   // Get a single analysis by its ID
    .delete(deleteAnalysis); // Delete a single analysis

export default router;
