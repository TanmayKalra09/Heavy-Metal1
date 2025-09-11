import multer from 'multer';

// Configure multer storage. For an MVP, storing the file in memory is efficient.
// This provides the file as a Buffer object, ready for parsing.
const storage = multer.memoryStorage();

// Create a filter to ensure that only CSV files are uploaded.
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
    }
};

// Initialize multer with the storage and file filter configuration.
// We'll accept a single file with the field name 'csvfile'.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // 10 MB file size limit
    },
}).single('csvfile'); // 'csvfile' must match the name attribute in the frontend form input

export { upload };