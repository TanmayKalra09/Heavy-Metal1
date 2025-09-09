# Heavy Metal Pollution Index - Frontend

This is the React frontend application for the Heavy Metal Pollution Index platform, designed for CGWB scientists and policymakers to analyze heavy metal contamination in groundwater.

## Features

- **User Authentication**: Secure login and registration system
- **Data Upload**: CSV file upload with validation for water quality data
- **Interactive Maps**: Geospatial visualization of contamination hotspots using Leaflet
- **Data Visualization**: Charts and graphs for HMPI analysis using Chart.js
- **Real-time Predictions**: Instant ML model inference on uploaded data
- **Report Generation**: Comprehensive PDF and Excel report downloads
- **Responsive Design**: Mobile-friendly interface using Material-UI

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Leaflet** for interactive maps
- **Chart.js** for data visualization
- **Axios** for API communication
- **React Hook Form** with Yup validation
- **React Toastify** for notifications

## Project Structure

```
client/
├── public/
│   └── index.html
├── src/
│   ├── api/                 # API service files
│   │   ├── auth.ts         # Authentication services
│   │   ├── predict.ts      # Prediction services
│   │   └── reports.ts      # Report services
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── FileUpload.tsx  # File upload component
│   │   ├── MapView.tsx     # Interactive map component
│   │   ├── DataTable.tsx   # Data table with sorting/filtering
│   │   ├── Charts.tsx      # Chart visualizations
│   │   └── ReportDownload.tsx # Report generation
│   ├── pages/              # Route-level components
│   │   ├── Home.tsx        # Landing page
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Upload.tsx      # Data upload page
│   ├── App.tsx             # Main app component
│   └── index.tsx           # App entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Key Components

### Authentication
- JWT-based authentication with token storage
- Protected routes for authenticated users
- User profile management

### Data Upload
- CSV file validation and parsing
- Drag-and-drop file upload interface
- Real-time upload progress tracking
- Error handling and validation feedback

### Data Visualization
- Interactive maps with color-coded risk indicators
- Multiple chart types (bar, pie, line charts)
- Filterable and sortable data tables
- Responsive design for all screen sizes

### Report Generation
- PDF and Excel report formats
- Customizable report templates
- Batch report generation
- Download and sharing capabilities

## API Integration

The frontend communicates with the backend API through service files:

- **Auth Service**: User authentication and profile management
- **Predict Service**: Data upload and HMPI predictions
- **Reports Service**: Report generation and management

## Styling and Theming

The application uses Material-UI's theming system with:
- Primary color: Blue (#1976d2)
- Secondary color: Pink (#dc004e)
- Responsive breakpoints
- Dark/light theme support (configurable)

## Data Format Requirements

For CSV uploads, the following columns are required:
- `latitude` - Decimal degrees
- `longitude` - Decimal degrees
- `date` - YYYY-MM-DD format
- Metal concentrations in mg/L:
  - `arsenic`, `cadmium`, `chromium`, `lead`, `mercury`
  - `zinc`, `copper`, `iron`, `manganese`, `nickel`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code structure and naming conventions
2. Use TypeScript for type safety
3. Implement responsive design principles
4. Add proper error handling and loading states
5. Write meaningful commit messages

## License

This project is part of the Heavy Metal Pollution Index platform for CGWB.