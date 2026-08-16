import React from 'react';

/**
 * Reusable sortable table component.
 * @param {Array} columns - Array of { key, label, sortable }
 * @param {Array} data - Data rows
 * @param {String} sortBy - Current sort key
 * @param {String} sortOrder - 'asc' or 'desc'
 * @param {Function} onSort - (key) => void
 * @param {Function} renderRow - (item) => ReactNode
 * @param {Boolean} loading - Loading state
 * @param {String} emptyMessage - Message to display when empty
 */
const SortableTable = ({ 
  columns, 
  data, 
  sortBy, 
  sortOrder, 
  onSort, 
  renderRow, 
  loading, 
  emptyMessage = 'No records found' 
}) => {
  const getSortIcon = (columnKey) => {
    if (sortBy !== columnKey) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>
      ) : data.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>{emptyMessage}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
              {columns.map(col => (
                <th 
                  key={col.key}
                  style={{ 
                    padding: '16px', 
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none'
                  }} 
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label} {col.sortable && getSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(renderRow)}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SortableTable;
