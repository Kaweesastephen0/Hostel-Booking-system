// DataTable.jsx - Add this safe capitalize function and fix IconButton usage
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Paper, IconButton, Box, Typography, CircularProgress, TableSortLabel
} from '@mui/material';

// Safe capitalize function
const safeCapitalize = (str) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const DataTable = ({
  columns,
  rows,
  loading,
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  orderBy,
  order,
  onRowClick,
  actions,
  emptyMessage = "No data found"
}) => {
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    onSort(columnId, isAsc ? 'desc' : 'asc');
  };

  const handleActionClick = (action, row, event) => {
    event.stopPropagation();
    action.onClick(row);
  };

  // Safe color validation
  const getSafeColor = (color) => {
    const validColors = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'default', 'inherit'];
    return validColors.includes(color) ? color : 'default';
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
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
              {actions && actions.length > 0 && (
                <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  <Box py={4}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                  <Box py={4}>
                    <Typography variant="body2" color="textSecondary">
                      {emptyMessage}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  hover={!!onRowClick}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.format
                        ? column.format(row[column.id], row)
                        : row[column.id] ?? '—'
                      }
                    </TableCell>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        {actions.map((action, actionIndex) => {
                          const icon = typeof action.icon === 'function'
                            ? action.icon(row)
                            : action.icon;

                          const tooltip = typeof action.tooltip === 'function'
                            ? action.tooltip(row)
                            : action.tooltip;

                          const color = typeof action.color === 'function'
                            ? getSafeColor(action.color(row))
                            : getSafeColor(action.color);

                          const disabled = typeof action.disabled === 'function'
                            ? action.disabled(row)
                            : action.disabled;

                          return (
                            <IconButton
                              key={actionIndex}
                              size="small"
                              title={tooltip}
                              onClick={(event) => handleActionClick(action, row, event)}
                              disabled={disabled}
                              color={color}
                            >
                              {icon}
                            </IconButton>
                          );
                        })}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
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