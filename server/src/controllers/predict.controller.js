import Analysis from '../models/Analysis.model.js';
import { calculatePollutionIndices } from '../services/pollutionIndex.service.js';
import { validateData } from '../utils/dataValidator.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Upload CSV file and process predictions
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded',
                uploadId: null,
                samplesCount: 0,
                validSamples: 0,
                invalidSamples: 0,
                errors: ['No file provided']
            });
        }

        const fileData = [];
        const stream = Readable.from(req.file.buffer.toString('utf8'));
        
        stream.pipe(csv())
            .on('data', (row) => fileData.push(row))
            .on('end', async () => {
                try {
                    // Process and validate data
                    const validSamples = [];
                    const invalidSamples = [];
                    const errors = [];

                    for (const row of fileData) {
                        try {
                            // Basic validation
                            if (!row.latitude || !row.longitude) {
                                invalidSamples.push(row);
                                errors.push('Missing latitude or longitude');
                                continue;
                            }

                            const sample = {
                                latitude: parseFloat(row.latitude),
                                longitude: parseFloat(row.longitude),
                                date: row.date || new Date().toISOString(),
                                arsenic: parseFloat(row.arsenic) || 0,
                                cadmium: parseFloat(row.cadmium) || 0,
                                chromium: parseFloat(row.chromium) || 0,
                                lead: parseFloat(row.lead) || 0,
                                mercury: parseFloat(row.mercury) || 0,
                                zinc: parseFloat(row.zinc) || 0,
                                copper: parseFloat(row.copper) || 0,
                                iron: parseFloat(row.iron) || 0,
                                manganese: parseFloat(row.manganese) || 0,
                                nickel: parseFloat(row.nickel) || 0
                            };

                            validSamples.push(sample);
                        } catch (error) {
                            invalidSamples.push(row);
                            errors.push(error.message);
                        }
                    }

                    // Create analysis record
                    const analysis = await Analysis.create({
                        user: req.user.id,
                        fileName: req.file.originalname,
                        inputParameters: {
                            metals: ['arsenic', 'cadmium', 'chromium', 'lead', 'mercury', 'zinc', 'copper', 'iron', 'manganese', 'nickel'],
                            standards: {},
                            backgrounds: {},
                            presenceLimits: {}
                        },
                        results: {
                            validSamples: validSamples.length,
                            invalidSamples: invalidSamples.length,
                            processedAt: new Date()
                        }
                    });

                    res.json({
                        message: 'File uploaded and processed successfully',
                        uploadId: analysis._id.toString(),
                        samplesCount: fileData.length,
                        validSamples: validSamples.length,
                        invalidSamples: invalidSamples.length,
                        errors: errors.slice(0, 10) // Limit errors shown
                    });

                } catch (error) {
                    res.status(500).json({
                        message: 'Error processing file',
                        error: error.message
                    });
                }
            });

    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

// Predict HMPI for a single sample
export const predictSingle = async (req, res) => {
    try {
        const sample = req.body;
        
        // Calculate HMPI (simplified calculation)
        const metalConcentrations = {
            arsenic: sample.arsenic || 0,
            cadmium: sample.cadmium || 0,
            chromium: sample.chromium || 0,
            lead: sample.lead || 0,
            mercury: sample.mercury || 0,
            zinc: sample.zinc || 0,
            copper: sample.copper || 0,
            iron: sample.iron || 0,
            manganese: sample.manganese || 0,
            nickel: sample.nickel || 0
        };

        // Simple HMPI calculation (you can replace with actual ML model)
        const hmpiScore = Object.values(metalConcentrations).reduce((sum, val) => sum + val, 0) / 10;
        
        let riskCategory = 'safe';
        if (hmpiScore > 100) riskCategory = 'unsafe';
        else if (hmpiScore > 50) riskCategory = 'caution';

        const result = {
            id: Date.now().toString(),
            sampleId: sample.id || Date.now().toString(),
            hmpiScore,
            riskCategory,
            metalConcentrations,
            location: {
                latitude: sample.latitude,
                longitude: sample.longitude
            },
            date: sample.date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: 'Error processing prediction',
            error: error.message
        });
    }
};

// Get batch prediction results
export const getBatchResults = async (req, res) => {
    try {
        const { uploadId } = req.params;
        
        const analysis = await Analysis.findById(uploadId);
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        // Mock batch results (replace with actual data)
        const results = [];
        const summary = {
            totalSamples: 0,
            safeCount: 0,
            cautionCount: 0,
            unsafeCount: 0,
            averageHMPI: 0
        };

        res.json({ results, summary });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching batch results',
            error: error.message
        });
    }
};

// Get all predictions with pagination
export const getAllPredictions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const analyses = await Analysis.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Analysis.countDocuments({ user: req.user.id });
        const totalPages = Math.ceil(total / limit);

        // Convert analyses to prediction format
        const predictions = analyses.map(analysis => ({
            id: analysis._id.toString(),
            sampleId: analysis._id.toString(),
            hmpiScore: Math.random() * 200, // Mock data
            riskCategory: ['safe', 'caution', 'unsafe'][Math.floor(Math.random() * 3)],
            metalConcentrations: {},
            location: { latitude: 0, longitude: 0 },
            date: analysis.createdAt.toISOString(),
            createdAt: analysis.createdAt.toISOString()
        }));

        res.json({
            predictions,
            total,
            page,
            totalPages
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching predictions',
            error: error.message
        });
    }
};

// Get predictions by location
export const getPredictionsByLocation = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.query;
        
        // Mock implementation - replace with actual geospatial query
        const predictions = [];
        
        res.json(predictions);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching predictions by location',
            error: error.message
        });
    }
};

// Get predictions by date range
export const getPredictionsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const analyses = await Analysis.find({
            user: req.user.id,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ createdAt: -1 });

        const predictions = analyses.map(analysis => ({
            id: analysis._id.toString(),
            sampleId: analysis._id.toString(),
            hmpiScore: Math.random() * 200,
            riskCategory: ['safe', 'caution', 'unsafe'][Math.floor(Math.random() * 3)],
            metalConcentrations: {},
            location: { latitude: 0, longitude: 0 },
            date: analysis.createdAt.toISOString(),
            createdAt: analysis.createdAt.toISOString()
        }));

        res.json(predictions);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching predictions by date range',
            error: error.message
        });
    }
};

// Delete prediction
export const deletePrediction = async (req, res) => {
    try {
        const { predictionId } = req.params;
        
        const analysis = await Analysis.findById(predictionId);
        if (!analysis) {
            return res.status(404).json({ message: 'Prediction not found' });
        }

        if (analysis.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await analysis.deleteOne();
        res.json({ message: 'Prediction deleted successfully' });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting prediction',
            error: error.message
        });
    }
};

// Get statistics
export const getStatistics = async (req, res) => {
    try {
        const totalPredictions = await Analysis.countDocuments({ user: req.user.id });
        
        // Mock statistics - replace with actual calculations
        const stats = {
            totalPredictions,
            safePercentage: 60,
            cautionPercentage: 30,
            unsafePercentage: 10,
            averageHMPI: 45.5,
            recentPredictions: []
        };

        res.json(stats);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// Get latest prediction
export const getLatestPrediction = async (req, res) => {
    try {
        const latestAnalysis = await Analysis.findOne({ user: req.user.id })
            .sort({ createdAt: -1 });

        if (!latestAnalysis) {
            return res.json(null);
        }

        const prediction = {
            id: latestAnalysis._id.toString(),
            sampleId: latestAnalysis._id.toString(),
            hmpiScore: Math.random() * 200,
            riskCategory: ['safe', 'caution', 'unsafe'][Math.floor(Math.random() * 3)],
            metalConcentrations: {},
            location: { latitude: 0, longitude: 0 },
            date: latestAnalysis.createdAt.toISOString(),
            createdAt: latestAnalysis.createdAt.toISOString()
        };

        res.json(prediction);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching latest prediction',
            error: error.message
        });
    }
};