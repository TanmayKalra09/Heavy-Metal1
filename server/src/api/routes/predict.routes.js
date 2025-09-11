import express from 'express';
import {
    uploadFile,
    predictSingle,
    getBatchResults,
    getAllPredictions,
    getPredictionsByLocation,
    getPredictionsByDateRange,
    deletePrediction,
    getStatistics,
    getLatestPrediction
} from '../../controllers/predict.controller.js';
import { upload } from '../../middlewares/fileUpload.js';

const router = express.Router();

// File upload and batch prediction
router.post('/upload', upload, uploadFile);

// Single prediction
router.post('/single', predictSingle);

// Get batch results
router.get('/batch/:uploadId', getBatchResults);

// Get all predictions with pagination
router.get('/all', getAllPredictions);

// Get predictions by location
router.get('/location', getPredictionsByLocation);

// Get predictions by date range
router.get('/date-range', getPredictionsByDateRange);

// Get statistics
router.get('/statistics', getStatistics);

// Get latest prediction (for real-time updates)
router.get('/latest', getLatestPrediction);

// Delete prediction
router.delete('/:predictionId', deletePrediction);

export default router;