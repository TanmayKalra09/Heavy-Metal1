import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Typography,
} from '@mui/material';
import {
  Search,
  FilterList,
  GetApp,
  Visibility,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { PredictionResult } from '../api/predict';

interface DataTableProps {
  data: PredictionResult[];
  onRowClick?: (row: PredictionResult) => void;
  onDelete?: (row: PredictionResult) => void;
  onExport?: (selectedRows: PredictionResult[]) => void;
  showActions?: boolean;
  selectable?: boolean;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof PredictionResult | 'location';

interface HeadCell {
  id: OrderBy;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'id', label: 'Sample ID', numeric: false, sortable: true },
  { id: 'date', label: 'Date', numeric: false, sortable: true },
  { id: 'location', label: 'Location', numeric: false, sortable: false },
  { id: 'hmpiScore', label: 'HMPI Score', numeric: true, sortable: true },
  { id: 'riskCategory', label: 'Risk Category', numeric: false, sortable: true },
  { id: 'createdAt', label: 'Analyzed', numeric: false, sortable: true },
];

const DataTable: React.FC<DataTableProps> = ({
  data,
  onRowClick,
  onDelete,
  onExport,
  showActions = true,
  selectable = false,
}) => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('createdAt');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const getRiskColor = (category: 'safe' | 'caution' | 'unsafe') => {
    switch (category) {
      case 'safe':
        return 'success';
      case 'caution':
        return 'warning';
      case 'unsafe':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatLocation = (lat: number, lng: number) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((row) => {
      const matchesSearch = 
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatLocation(row.location.latitude, row.location.longitude).includes(searchTerm);
      
      const matchesFilter = 
        filterCategory === 'all' || row.riskCategory === filterCategory;

      return matchesSearch && matchesFilter;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (orderBy) {
        case 'location':
          aValue = `${a.location.latitude},${a.location.longitude}`;
          bValue = `${b.location.latitude},${b.location.longitude}`;
          break;
        default:
          aValue = a[orderBy];
          bValue = b[orderBy];
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === 'desc') {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [data, searchTerm, filterCategory, order, orderBy]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, page, rowsPerPage]);

  const handleExportSelected = () => {
    const selected = data.filter((row) => selectedRows.includes(row.id));
    onExport?.(selected);
  };

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by ID or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{ minWidth: 250 }}
        />

        <TextField
          select
          label="Filter by Risk"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="safe">Safe</MenuItem>
          <MenuItem value="caution">Caution</MenuItem>
          <MenuItem value="unsafe">Unsafe</MenuItem>
        </TextField>

        {selectable && selectedRows.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<GetApp />}
            onClick={handleExportSelected}
          >
            Export Selected ({selectedRows.length})
          </Button>
        )}

        <Box sx={{ ml: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredAndSortedData.length} of {data.length} samples
          </Typography>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
              {showActions && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                <TableCell>{row.id.slice(-8)}</TableCell>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell>
                  {formatLocation(row.location.latitude, row.location.longitude)}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    color={
                      row.hmpiScore > 100 ? 'error.main' :
                      row.hmpiScore > 50 ? 'warning.main' : 'success.main'
                    }
                    fontWeight="medium"
                  >
                    {row.hmpiScore.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.riskCategory.toUpperCase()}
                    color={getRiskColor(row.riskCategory) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                {showActions && (
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(row);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(e, row.id);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredAndSortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const row = data.find((r) => r.id === menuRowId);
            if (row) onRowClick?.(row);
            handleMenuClose();
          }}
        >
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {onDelete && (
          <MenuItem
            onClick={() => {
              const row = data.find((r) => r.id === menuRowId);
              if (row) onDelete(row);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default DataTable;