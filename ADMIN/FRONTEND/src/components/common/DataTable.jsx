import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  IconButton as MuiIconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const DataTable = ({
  columns,
  rows = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  orderBy,
  order = 'asc',
  onRowClick,
  actions = [],
  emptyMessage = 'No data available',
}) => {
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    onSort(property, isAsc ? 'desc' : 'asc');
  };

  return (
    <Paper sx={{ width: '100%'}} >
      <TableContainer sx={{ maxHeight: '50%' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} align="center">
                  <Box p={4}>
                    <CircularProgress />
                    <Typography>Loading...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} align="center">
                  <Box p={4}>
                    <Typography>{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <StyledTableRow
                  hover
                  key={row.id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.format ? column.format(value, row) : value}
                      </TableCell>
                    );
                  })}
                  {actions.length > 0 && (
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {actions.map((action, idx) => {
                          // dynamic icon, tooltip, color, and disabled state
                          const icon = action.getIcon ? action.getIcon(row) : action.icon;
                          const tooltip = action.getTooltip ? action.getTooltip(row) : action.tooltip;
                          const color = action.getColor ? action.getColor(row) : action.color;
                          const disabled = typeof action.disabled === 'function'
                            ? action.disabled(row)
                            : Boolean(action.disabled);

                          return (
                            <Tooltip key={idx} title={tooltip}>
                              <MuiIconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  try {
                                    action.onClick(row);
                                  } catch (error) {
                                    console.error('Action error:', error);
                                  }
                                }}
                                color={color || 'primary'}
                                size="small"
                                disabled={disabled}
                              >
                                {React.isValidElement(icon) ? icon : null}
                              </MuiIconButton>
                            </Tooltip>
                          );
                        })}
                      </Box>
                    </TableCell>
                  )}
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default DataTable;
