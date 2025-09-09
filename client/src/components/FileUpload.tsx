import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { predictService, UploadResponse } from '../api/predict';

interface FileUploadProps {
  onUploadComplete: (response: UploadResponse) => void;
  onUploadError: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  multiple?: boolean;
}

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  response?: UploadResponse;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0,
    }));

    setUploadFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxSize: maxFileSize,
    multiple,
  });

  const removeFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    setUploadFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    );

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          )
        );
      }, 200);

      const response = await predictService.uploadFile(uploadFile.file);

      clearInterval(progressInterval);

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'success', progress: 100, response }
            : f
        )
      );

      onUploadComplete(response);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      
      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', progress: 0, error: errorMessage }
            : f
        )
      );

      onUploadError(errorMessage);
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    const pendingFiles = uploadFiles.filter((f) => f.status === 'pending');

    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    setIsUploading(false);
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'uploading':
        return <CloudUpload color="primary" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getStatusColor = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Accepted formats: {acceptedFileTypes.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size: {formatFileSize(maxFileSize)}
        </Typography>
      </Paper>

      {fileRejections.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">File(s) rejected:</Typography>
          {fileRejections.map(({ file, errors }) => (
            <Typography key={file.name} variant="body2">
              {file.name}: {errors.map((e) => e.message).join(', ')}
            </Typography>
          ))}
        </Alert>
      )}

      {uploadFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Files to Upload</Typography>
            <Button
              variant="contained"
              onClick={uploadAllFiles}
              disabled={isUploading || uploadFiles.every((f) => f.status !== 'pending')}
              startIcon={<CloudUpload />}
            >
              Upload All
            </Button>
          </Box>

          <List>
            {uploadFiles.map((uploadFile) => (
              <ListItem key={uploadFile.id} divider>
                <ListItemIcon>{getStatusIcon(uploadFile.status)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{uploadFile.file.name}</Typography>
                      <Chip
                        label={uploadFile.status}
                        size="small"
                        color={getStatusColor(uploadFile.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(uploadFile.file.size)}
                      </Typography>
                      {uploadFile.status === 'uploading' && (
                        <LinearProgress
                          variant="determinate"
                          value={uploadFile.progress}
                          sx={{ mt: 1 }}
                        />
                      )}
                      {uploadFile.error && (
                        <Typography variant="body2" color="error">
                          {uploadFile.error}
                        </Typography>
                      )}
                      {uploadFile.response && (
                        <Typography variant="body2" color="success.main">
                          {uploadFile.response.validSamples} valid samples processed
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <IconButton
                  edge="end"
                  onClick={() => removeFile(uploadFile.id)}
                  disabled={uploadFile.status === 'uploading'}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;