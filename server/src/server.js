import 'dotenv/config'; // Make sure environment variables are loaded
import app from './app.js';
import connectDB from './config/db.config.js';

// --- Connect to Database ---
connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(` Server is running successfully on http://localhost:${PORT}`);
});