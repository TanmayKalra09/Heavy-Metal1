# Heavy Metal Pollution Index (HMPI) Application

A comprehensive web application for analyzing water quality and calculating Heavy Metal Pollution Index using machine learning algorithms.

## Features

- **Automated HMPI Computation**: Calculate pollution indices using advanced ML algorithms
- **CSV Data Upload**: Easy bulk data processing from CSV files
- **Interactive Dashboard**: Real-time visualization of water quality data
- **Geospatial Mapping**: Location-based contamination analysis
- **User Authentication**: Secure login and data management
- **Report Generation**: Comprehensive PDF and Excel reports
- **Data Visualization**: Charts and graphs for trend analysis

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for components
- React Router for navigation
- Axios for API calls
- Chart.js for data visualization
- Leaflet for mapping

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- CSV parsing capabilities
- CORS enabled

## Project Structure

```
Heavy-Metal-SIH/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API service files
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── api/routes/    # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── middlewares/   # Custom middlewares
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── package.json
└── package.json           # Root package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Heavy-Metal-SIH
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Configuration**
   
   **Server (.env in server directory):**
   ```env
   PORT=8000
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   MONGO_URI=your-mongodb-connection-string
   GRADIO_API_URL=your-gradio-api-url
   ```
   
   **Client (.env in client directory):**
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_SERVER_URL=http://localhost:8000
   ```

4. **Start the application**
   ```bash
   # Development mode (runs both client and server)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend on http://localhost:8000
   npm run client  # Frontend on http://localhost:3000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Data Management
- `POST /api/data/upload` - Upload CSV file for analysis
- `GET /api/data` - Get all analyses for user
- `GET /api/data/:id` - Get specific analysis
- `DELETE /api/data/:id` - Delete analysis

### Predictions
- `POST /api/predict/upload` - Upload file for batch prediction
- `POST /api/predict/single` - Single sample prediction
- `GET /api/predict/batch/:uploadId` - Get batch results
- `GET /api/predict/all` - Get all predictions
- `GET /api/predict/statistics` - Get prediction statistics

### Reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/download` - Download report file

## Usage

1. **Register/Login**: Create an account or login to existing account
2. **Upload Data**: Upload CSV files with water quality measurements
3. **View Results**: Analyze HMPI calculations and visualizations
4. **Generate Reports**: Create comprehensive reports in PDF/Excel format
5. **Monitor Trends**: Track water quality changes over time

## CSV File Format

Your CSV file should include the following columns:
- `latitude` - Location latitude
- `longitude` - Location longitude
- `date` - Sample collection date
- `arsenic` - Arsenic concentration
- `cadmium` - Cadmium concentration
- `chromium` - Chromium concentration
- `lead` - Lead concentration
- `mercury` - Mercury concentration
- `zinc` - Zinc concentration
- `copper` - Copper concentration
- `iron` - Iron concentration
- `manganese` - Manganese concentration
- `nickel` - Nickel concentration

## Development

### Adding New Features
1. Backend: Add routes in `server/src/api/routes/`
2. Backend: Add controllers in `server/src/controllers/`
3. Frontend: Add API services in `client/src/api/`
4. Frontend: Add components in `client/src/components/`

### Database Models
- **User**: User authentication and profile
- **Analysis**: Analysis results and metadata
- **Sample**: Individual water sample data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details