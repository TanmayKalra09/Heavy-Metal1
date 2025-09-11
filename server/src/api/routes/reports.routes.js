import express from 'express';
import {
    generateReport,
    getAllReports,
    getReport,
    getReportData,
    downloadReport,
    deleteReport,
    getReportStatus,
    exportCSV,
    getReportTemplates,
    saveReportTemplate,
    scheduleReport,
    getScheduledReports,
    cancelScheduledReport
} from '../../controllers/reports.controller.js';

const router = express.Router();

// Generate new report
router.post('/generate', generateReport);

// Get all reports
router.get('/', getAllReports);

// Export CSV
router.post('/export/csv', exportCSV);

// Report templates
router.get('/templates', getReportTemplates);
router.post('/templates', saveReportTemplate);

// Scheduled reports
router.get('/scheduled', getScheduledReports);
router.post('/schedule', scheduleReport);
router.delete('/scheduled/:scheduleId', cancelScheduledReport);

// Specific report operations
router.get('/:reportId', getReport);
router.get('/:reportId/data', getReportData);
router.get('/:reportId/download', downloadReport);
router.get('/:reportId/status', getReportStatus);
router.delete('/:reportId', deleteReport);

export default router;