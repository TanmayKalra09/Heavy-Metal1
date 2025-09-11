import Analysis from '../models/Analysis.model.js';
import { calculatePollutionIndices } from '../services/pollutionIndex.service.js';
import { validateData } from '../utils/dataValidator.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

/**
 * @desc    Upload a CSV file, trigger analysis, and save the results
 * @route   POST /api/data/upload
 * @access  Private (Authenticated users only)
 */
export const uploadAndProcessFile = async (req, res, next) => {
    try {
        // --- FIX: Add a defensive check to ensure user is authenticated ---
        if (!req.user) {
            res.status(401);
            throw new Error('Authentication error: User not found.');
        }

        // --- 1. Initial Validation ---
        if (!req.file) {
            res.status(400);
            throw new Error('No CSV file uploaded. Please provide a file with the key "csvfile".');
        }

        // Capture user ID and file name before the stream starts to avoid scope issues.
        const userId = req.user.id;
        const originalFileName = req.file.originalname;

        const { metals, standards, backgrounds, presenceLimits } = req.body;
        if (!metals || !standards || !backgrounds || !presenceLimits) {
            res.status(400);
            throw new Error('Missing one or more required parameters: metals, standards, backgrounds, presenceLimits.');
        }

        // --- 2. Process the file using a stream for efficiency ---
        const fileData = [];
        const stream = Readable.from(req.file.buffer.toString('utf8'));

        stream.pipe(csv())
            .on('data', (row) => fileData.push(row))
            .on('end', async () => {
                try {
                    // --- 3. Parse Parameters & Validate Data ---
                    const parsedParams = {
                        metals: JSON.parse(metals),
                        standards: JSON.parse(standards),
                        backgrounds: JSON.parse(backgrounds),
                        presenceLimits: JSON.parse(presenceLimits),
                    };

                    validateData(fileData, parsedParams.metals);

                    // --- 4. Call the Calculation Service ---
                    // This service will call the Gradio model or return mock data.
                    const analysisResult = await calculatePollutionIndices(fileData, parsedParams);

                    // --- 5. Save the complete analysis to the database ---
                    const newAnalysis = await Analysis.create({
                        user: userId,
                        fileName: originalFileName,
                        inputParameters: parsedParams,
                        results: analysisResult,
                    });

                    // --- 6. Send Success Response ---
                    res.status(201).json({
                        message: 'File processed and analysis saved successfully.',
                        analysisId: newAnalysis._id,
                        data: newAnalysis, // Send back the created document
                    });

                } catch (error) {
                    // Pass errors from within the stream to the main error handler
                    next(error);
                }
            });

    } catch (error) {
        // Pass initial validation errors to the main error handler
        next(error);
    }
};

/**
 * @desc    Get a list of all past analyses for the logged-in user
 * @route   GET /api/data
 * @access  Private
 */
export const getAllAnalyses = async (req, res, next) => {
    try {
        // Find all analyses belonging to the current user, sorted by newest first.
        const analyses = await Analysis.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(analyses);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single analysis record by its ID
 * @route   GET /api/data/:id
 * @access  Private
 */
export const getAnalysisById = async (req, res, next) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            res.status(404);
            throw new Error('Analysis not found.');
        }

        // Security check: Ensure the analysis belongs to the user making the request.
        if (analysis.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to access this analysis.');
        }

        res.status(200).json(analysis);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an analysis record by its ID
 * @route   DELETE /api/data/:id
 * @access  Private
 */
export const deleteAnalysis = async (req, res, next) => {
    try {
        const analysis = await Analysis.findById(req.params.id);

        if (!analysis) {
            res.status(404);
            throw new Error('Analysis not found.');
        }

        // Security check: Ensure the analysis belongs to the user making the request.
        if (analysis.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to delete this analysis.');
        }

        await analysis.deleteOne();

        res.status(200).json({ message: 'Analysis deleted successfully.', id: req.params.id });
    } catch (error) {
        next(error);
    }
};

