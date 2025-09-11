import express from 'express';
import cors from 'cors';
import authRoutes from './api/routes/auth.routes.js';
import { protect } from './middlewares/auth.js';

// --- Placeholder for future routes that will be protected ---
// We will create data.routes.js in a later step.
import dataRoutes from './api/routes/data.routes.js';
import predictRoutes from './api/routes/predict.routes.js';
import reportsRoutes from './api/routes/reports.routes.js';

const app = express();

// --- Core Middlewares ---

// Enable CORS (Cross-Origin Resource Sharing) to allow frontend communication
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-production-domain.com'] 
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable Express to parse incoming JSON in request bodies
app.use(express.json());


// --- API Routes ---

// A simple test route to check server status
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Heavy Metal Pollution Index API!' });
});


// --- Public Routes ---
// These routes do not require a token for access.
app.use('/api/auth', authRoutes);


// --- Protected Routes (Example) ---
// The 'protect' middleware will run before any route defined in dataRoutes.
// An incoming request must have a valid JWT to access these endpoints.
// We will uncomment this line when we build the data upload feature.
app.use('/api/data', protect, dataRoutes);
app.use('/api/predict', protect, predictRoutes);
app.use('/api/reports', protect, reportsRoutes);

// --- Error Handler Middleware (must be last) ---
import { errorHandler } from './middlewares/errorHandler.js';
app.use(errorHandler);

export default app;