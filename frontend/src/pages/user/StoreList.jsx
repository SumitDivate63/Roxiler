import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination & Filters state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Rating submission states (for inline success/error)
  const [ratingLoading, setRatingLoading] = useState(null); // storeId
  const [ratingMessage, setRatingMessage] = useState({ storeId: null, type: '', text: '' });

  const fetchStores = async (currentPage = page, currentSearch = search, currentSortBy = sortBy, currentOrder = sortOrder) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        sortBy: currentSortBy,
        order: currentOrder
      });
      if (currentSearch) params.append('search', currentSearch);

      const response = await api.get(`/stores?${params.toString()}`);
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
    fetchStores(page, search, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortBy, sortOrder]); // Search is triggered manually or cleared

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStores(1, search, sortBy, sortOrder);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    fetchStores(1, '', sortBy, sortOrder);
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
    setPage(1);
  };

  const handleRatingSubmit = async (storeId, value) => {
    if (!value) return;
    const numericValue = parseInt(value, 10);
    
    setRatingLoading(storeId);
    setRatingMessage({ storeId: null, type: '', text: '' });

    try {
      const response = await api.post('/ratings', { storeId, value: numericValue });
      if (response.data.success) {
        const { rating, averageRating } = response.data.data;
        
        // Optimistically update the specific row
        setStores(prev => prev.map(s => {
          if (s.id === storeId) {
            return {
              ...s,
              userRating: rating.value,
              averageRating: averageRating
            };
          }
          return s;
        }));
        
        setRatingMessage({ storeId, type: 'success', text: 'Rating saved!' });
        setTimeout(() => setRatingMessage({ storeId: null, type: '', text: '' }), 3000);
      }
    } catch (err) {
      let msg = 'Failed to submit rating.';
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      setRatingMessage({ storeId, type: 'error', text: msg });
    } finally {
      setRatingLoading(null);
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: 'var(--color-primary)' }}>Store Directory</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text"
            placeholder="Search name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px' }}
            aria-label="Search stores"
          />
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" className="btn-secondary" onClick={handleClearSearch}>Clear</button>
        </form>
      </div>

      {error && <div className="error-text" style={{ padding: '16px', backgroundColor: '#FCE8E8', marginBottom: '16px', borderRadius: '4px' }}>{error}</div>}

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading stores...</div>
        ) : stores.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            {search ? 'No stores found matching your search.' : 'No stores registered yet.'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Store Name {getSortIcon('name')}
                </th>
                <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleSort('address')}>
                  Address {getSortIcon('address')}
                </th>
                <th style={{ padding: '16px', cursor: 'pointer' }} onClick={() => handleSort('averageRating')}>
                  Overall Rating {getSortIcon('averageRating')}
                </th>
                <th style={{ padding: '16px' }}>My Rating</th>
                <th style={{ padding: '16px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{store.name}</td>
                  <td style={{ padding: '16px', color: 'var(--color-text-secondary)' }}>{store.address || '—'}</td>
                  <td style={{ padding: '16px', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                    {store.averageRating > 0 ? Number(store.averageRating).toFixed(2) : <span style={{color: 'var(--color-text-secondary)', fontWeight: 'normal'}}>No ratings yet</span>}
                  </td>
                  <td style={{ padding: '16px' }}>
                    {store.userRating !== null ? (
                      <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{store.userRating}</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-secondary)' }}>Not rated</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select 
                        defaultValue={store.userRating || ""}
                        onChange={(e) => handleRatingSubmit(store.id, e.target.value)}
                        disabled={ratingLoading === store.id}
                        aria-label={`Rate ${store.name}`}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                      >
                        <option value="" disabled>Select</option>
                        {[1, 2, 3, 4, 5].map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                      
                      {ratingLoading === store.id && <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Saving...</span>}
                      {ratingMessage.storeId === store.id && (
                        <span style={{ fontSize: '12px', color: ratingMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>
                          {ratingMessage.text}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
