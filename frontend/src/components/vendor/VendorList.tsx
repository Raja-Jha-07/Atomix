import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Button,
  Rating,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import vendorService, { VendorResponse, PaginatedResponse } from '../../services/vendorService';

interface VendorListProps {
  showActions?: boolean;
  statusFilter?: string;
  typeFilter?: string;
  onVendorEdit?: (vendor: VendorResponse) => void;
  onVendorCreate?: () => void;
}

interface Order {
  field: string;
  direction: 'asc' | 'desc';
}

const VendorList: React.FC<VendorListProps> = ({
  showActions = true,
  statusFilter,
  typeFilter,
  onVendorEdit,
  onVendorCreate,
}) => {
  const [vendors, setVendors] = useState<PaginatedResponse<VendorResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>({ field: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [localStatusFilter, setLocalStatusFilter] = useState(statusFilter || '');
  const [localTypeFilter, setLocalTypeFilter] = useState(typeFilter || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorResponse | null>(null);

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result: PaginatedResponse<VendorResponse>;

      if (searchTerm.trim()) {
        result = await vendorService.searchVendors(searchTerm, true, page, rowsPerPage);
      } else if (localStatusFilter) {
        result = await vendorService.getVendorsByStatus(localStatusFilter, page, rowsPerPage);
      } else if (localTypeFilter) {
        result = await vendorService.getVendorsByType(localTypeFilter, page, rowsPerPage);
      } else {
        result = await vendorService.getAllVendors(page, rowsPerPage, order.field, order.direction);
      }

      setVendors(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, rowsPerPage, localStatusFilter, localTypeFilter, order]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleSort = (field: string) => {
    const isAsc = order.field === field && order.direction === 'asc';
    setOrder({ field, direction: isAsc ? 'desc' : 'asc' });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vendor: VendorResponse) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVendor(null);
  };

  const handleEdit = () => {
    if (selectedVendor && onVendorEdit) {
      onVendorEdit(selectedVendor);
    }
    handleMenuClose();
  };

  const handleToggleActive = async () => {
    if (!selectedVendor) return;

    try {
      await vendorService.toggleVendorActiveStatus(selectedVendor.id);
      loadVendors(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
    handleMenuClose();
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedVendor) return;

    try {
      await vendorService.updateVendorStatus(selectedVendor.id, { status });
      loadVendors(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedVendor) return;

    if (window.confirm(`Are you sure you want to delete vendor "${selectedVendor.name}"?`)) {
      try {
        await vendorService.deleteVendor(selectedVendor.id);
        loadVendors(); // Refresh the list
      } catch (err: any) {
        setError(err.message);
      }
    }
    handleMenuClose();
  };

  const getStatusChip = (vendor: VendorResponse) => {
    const getColor = (status: string) => {
      switch (status) {
        case 'APPROVED': return 'success';
        case 'PENDING': return 'warning';
        case 'REJECTED': return 'error';
        case 'SUSPENDED': return 'error';
        case 'INACTIVE': return 'default';
        default: return 'default';
      }
    };

    return (
      <Chip
        label={vendor.statusDisplayName}
        color={getColor(vendor.status) as any}
        size="small"
        variant={vendor.isActive ? 'filled' : 'outlined'}
      />
    );
  };

  const getTypeChip = (vendor: VendorResponse) => {
    return (
      <Chip
        label={vendor.vendorTypeDisplayName}
        color={vendor.isTemporary ? 'secondary' : 'primary'}
        size="small"
        variant="outlined"
      />
    );
  };

  if (loading && !vendors) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header and Filters */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Vendors</Typography>
          {onVendorCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onVendorCreate}
            >
              Add Vendor
            </Button>
          )}
        </Box>

        {/* Search and Filters */}
        <Box display="flex" gap={2} mb={3}>
          <TextField
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ minWidth: 300 }}
          />

          {!statusFilter && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={localStatusFilter}
                label="Status"
                onChange={(e) => setLocalStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
                <MenuItem value="SUSPENDED">Suspended</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          )}

          {!typeFilter && (
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={localTypeFilter}
                label="Type"
                onChange={(e) => setLocalTypeFilter(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="PERMANENT">Permanent</MenuItem>
                <MenuItem value="TEMPORARY">Temporary</MenuItem>
                <MenuItem value="SEASONAL">Seasonal</MenuItem>
                <MenuItem value="EVENT_BASED">Event Based</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={order.field === 'status'}
                    direction={order.field === 'status' ? order.direction : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={order.field === 'averageRating'}
                    direction={order.field === 'averageRating' ? order.direction : 'asc'}
                    onClick={() => handleSort('averageRating')}
                  >
                    Rating
                  </TableSortLabel>
                </TableCell>
                <TableCell>Menu Items</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={order.field === 'createdAt'}
                    direction={order.field === 'createdAt' ? order.direction : 'asc'}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                  </TableSortLabel>
                </TableCell>
                {showActions && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors?.content.map((vendor) => (
                <TableRow key={vendor.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={vendor.logoUrl} alt={vendor.name}>
                        {vendor.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{vendor.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {vendor.contactEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{getStatusChip(vendor)}</TableCell>
                  <TableCell>{getTypeChip(vendor)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.contactPerson || '-'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {vendor.contactPhone || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating value={vendor.averageRating} readOnly size="small" />
                      <Typography variant="caption">
                        ({vendor.totalReviews})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.totalMenuItems}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, vendor)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {vendors && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={vendors.totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {onVendorEdit && (
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
          
          {selectedVendor && (
            <MenuItem onClick={handleToggleActive}>
              {selectedVendor.isActive ? (
                <>
                  <ToggleOffIcon fontSize="small" sx={{ mr: 1 }} />
                  Deactivate
                </>
              ) : (
                <>
                  <ToggleOnIcon fontSize="small" sx={{ mr: 1 }} />
                  Activate
                </>
              )}
            </MenuItem>
          )}

          {selectedVendor?.status === 'PENDING' && (
            <>
              <MenuItem onClick={() => handleStatusUpdate('APPROVED')}>
                <ApproveIcon fontSize="small" sx={{ mr: 1 }} />
                Approve
              </MenuItem>
              <MenuItem onClick={() => handleStatusUpdate('REJECTED')}>
                <RejectIcon fontSize="small" sx={{ mr: 1 }} />
                Reject
              </MenuItem>
            </>
          )}

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default VendorList; 