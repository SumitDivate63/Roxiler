import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import SortableTable from '../../components/SortableTable';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [activeFilters, setActiveFilters] = useState({ name: '', email: '', address: '' });
  
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = async (currentPage, currentFilters, currentSortBy, currentSortOrder) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        sortBy: currentSortBy,
        sort: currentSortOrder // backend uses 'sort'
      });
      
      if (currentFilters.name) params.append('name', currentFilters.name);
      if (currentFilters.email) params.append('email', currentFilters.email);
      if (currentFilters.address) params.append('address', currentFilters.address);

      const response = await api.get(`/admin/stores?${params.toString()}`);
      if (response.data.success) {
        setStores(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError('Failed to fetch stores. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(page, activeFilters, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeFilters, sortBy, sortOrder]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    const empty = { name: '', email: '', address: '' };
    setFilters(empty);
    setActiveFilters(empty);
    setPage(1);
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
    setPage(1);
  };

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'averageRating', label: 'Average Rating', sortable: true },
  ];

  const renderRow = (store) => (
    <tr key={store.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
      <td style={{ padding: '16px', fontWeight: '500' }}>{store.name}</td>
      <td style={{ padding: '16px' }}>{store.email}</td>
      <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>{store.address || '—'}</td>
      <td style={{ padding: '16px', color: 'var(--color-accent)', fontWeight: 'bold' }}>
        {store.averageRating > 0 ? Number(store.averageRating).toFixed(2) : <span style={{color: 'var(--color-text-secondary)', fontWeight: 'normal'}}>No ratings yet</span>}
      </td>
    </tr>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Store Management</h1>
        <Link to="/admin/stores/add" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', color: 'white' }}>
          + Add Store
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Name</label>
            <input 
              type="text"
              value={filters.name}
              onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Email</label>
            <input 
              type="text"
              value={filters.email}
              onChange={(e) => setFilters(prev => ({...prev, email: e.target.value}))}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Address</label>
            <input 
              type="text"
              value={filters.address}
              onChange={(e) => setFilters(prev => ({...prev, address: e.target.value}))}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="btn-primary" style={{ height: '35px' }}>Filter</button>
            <button type="button" className="btn-secondary" onClick={handleClearFilters} style={{ height: '35px' }}>Clear</button>
          </div>
        </form>
      </div>

      {error && <div className="error-text" style={{ padding: '16px', backgroundColor: '#FCE8E8', marginBottom: '16px', borderRadius: '4px' }}>{error}</div>}

      <SortableTable 
        columns={columns}
        data={stores}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        loading={loading}
        emptyMessage="No stores found."
        renderRow={renderRow}
      />

      {!loading && stores.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            Showing page {page} of {pagination.totalPages} ({pagination.total} total)
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-secondary" 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <button 
              className="btn-secondary" 
              disabled={page >= pagination.totalPages} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreList;
