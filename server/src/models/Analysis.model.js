import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
    {
        // Link to the user who uploaded and ran this analysis
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This creates a reference to the User model
        },
        fileName: {
            type: String,
            required: true,
        },
        // Store the exact parameters used for this analysis run
        inputParameters: {
            metals: [String],
            standards: mongoose.Schema.Types.Mixed,
            backgrounds: mongoose.Schema.Types.Mixed,
            presenceLimits: mongoose.Schema.Types.Mixed,
        },
        // Store the final calculated results
        results: {
            // The full data table with original columns + new calculated indices
            processedData: [mongoose.Schema.Types.Mixed],

            // Summary statistics shown at the bottom
            summary: {
                meanIndices: mongoose.Schema.Types.Mixed,
                categoryCounts: mongoose.Schema.Types.Mixed,
            },
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
