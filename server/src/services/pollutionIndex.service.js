import axios from 'axios';

// Configuration
const GRADIO_API_URL = process.env.GRADIO_API_URL || 'YOUR_GRADIO_API_ENDPOINT_HERE';
const USE_MOCK = process.env.NODE_ENV === 'development' || process.env.USE_MOCK === 'true';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT) || 30000; // 30 seconds default

// Input validation helper
const validateInputs = (data, parameters) => {
    if (!data) {
        throw new Error('Data is required for pollution calculation');
    }

    if (!Array.isArray(data) && typeof data !== 'object') {
        throw new Error('Data must be an array or object');
    }

    if (parameters && typeof parameters !== 'object') {
        throw new Error('Parameters must be an object');
    }
};

/**
 * MOCK implementation for development and testing
 */
const calculatePollutionIndicesMock = async (data, parameters) => {
    console.log('--- MOCK SERVICE: Using mock data for pollution calculation ---');
    console.log('Input data:', JSON.stringify(data, null, 2));
    console.log('Parameters:', JSON.stringify(parameters, null, 2));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResults = {
        success: true,
        processedData: [
            {
                "As": 6.09,
                "Pb": 2.41,
                "HMPI": 77.16,
                "Quality": "Unsafe",
                "HEI": 2.25,
                "Note": "Mock Data - Sample 1",
                "timestamp": new Date().toISOString()
            },
            {
                "As": 8.43,
                "Pb": 9.71,
                "HMPI": 94.35,
                "Quality": "Unsafe",
                "HEI": 92.63,
                "Note": "Mock Data - Sample 2",
                "timestamp": new Date().toISOString()
            },
        ],
        summary: {
            meanIndices: {
                "HPI": 58.80,
                "HEI": 2.38,
                "PLI": 1.09,
                "NPI": 0.79
            },
            categoryCounts: {
                "Alert": 100,
                "Unsafe": 200,
                "Safe": 150
            },
            totalSamples: 450,
            processingTime: "1.2s"
        },
        metadata: {
            model: "mock-pollution-model-v1.0",
            version: "1.0.0",
            timestamp: new Date().toISOString()
        }
    };

    return mockResults;
};

/**
 * REAL implementation for production use
 */
const calculatePollutionIndicesReal = async (data, parameters) => {
    // Validate API endpoint configuration
    if (!GRADIO_API_URL || GRADIO_API_URL === 'YOUR_GRADIO_API_ENDPOINT_HERE') {
        throw new Error('GRADIO_API_URL environment variable is not properly configured');
    }

    try {
        console.log(`Calling Gradio model at: ${GRADIO_API_URL}`);
        console.log('Payload data length:', Array.isArray(data) ? data.length : 'object');

        const payload = {
            data: [data, parameters || {}],
            timeout: API_TIMEOUT
        };

        const response = await axios.post(GRADIO_API_URL, payload, {
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PollutionService/1.0'
            },
            validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        });

        // Handle different response status codes
        if (response.status >= 400) {
            throw new Error(`API returned error status: ${response.status} - ${response.statusText}`);
        }

        // Validate response structure
        if (!response.data) {
            throw new Error('Empty response from calculation model');
        }

        if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
            throw new Error('Invalid response structure from calculation model');
        }

        const result = response.data.data[0];

        // Basic validation of result structure
        if (!result || typeof result !== 'object') {
            throw new Error('Invalid result format from calculation model');
        }

        console.log('Successfully received data from Gradio model');
        return {
            success: true,
            ...result,
            metadata: {
                apiEndpoint: GRADIO_API_URL,
                timestamp: new Date().toISOString(),
                responseTime: response.headers['x-response-time'] || 'unknown'
            }
        };

    } catch (error) {
        console.error('Error communicating with Gradio model:', {
            message: error.message,
            url: GRADIO_API_URL,
            code: error.code,
            response: error.response?.status,
            data: error.response?.data
        });

        // Provide specific error messages based on error type
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to the calculation service. Please check if the service is running.');
        }

        if (error.code === 'ENOTFOUND') {
            throw new Error('Calculation service endpoint not found. Please check the API URL configuration.');
        }

        if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            throw new Error('Request to calculation service timed out. Please try again.');
        }

        if (error.response?.status === 429) {
            throw new Error('Too many requests to calculation service. Please try again later.');
        }

        if (error.response?.status >= 500) {
            throw new Error('Calculation service is temporarily unavailable. Please try again later.');
        }

        // Re-throw with more user-friendly message
        throw new Error(`Calculation service error: ${error.message}`);
    }
};

/**
 * Main export function that chooses between mock and real implementation
 */
export const calculatePollutionIndices = async (data, parameters = {}) => {
    try {
        // Input validation
        validateInputs(data, parameters);

        // Choose implementation based on environment
        if (USE_MOCK) {
            return await calculatePollutionIndicesMock(data, parameters);
        } else {
            return await calculatePollutionIndicesReal(data, parameters);
        }

    } catch (error) {
        console.error('Pollution calculation error:', error.message);

        // Return structured error response
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
            usedMock: USE_MOCK
        };
    }
};

// Health check function for the service
export const checkServiceHealth = async () => {
    if (USE_MOCK) {
        return {
            status: 'healthy',
            service: 'mock',
            timestamp: new Date().toISOString()
        };
    }

    try {
        // Simple health check - you might want to implement a specific health endpoint
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await axios.get(GRADIO_API_URL.replace('/predict', '/health') || GRADIO_API_URL, {
            signal: controller.signal,
            timeout: 5000
        });

        clearTimeout(timeoutId);

        return {
            status: 'healthy',
            service: 'real',
            endpoint: GRADIO_API_URL,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            service: 'real',
            endpoint: GRADIO_API_URL,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
};