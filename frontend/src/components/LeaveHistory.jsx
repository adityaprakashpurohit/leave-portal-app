import { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';

export default function LeaveHistory({ userRole, refreshKey }) {
  const [leaves, setLeaves] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaves = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus !== 'all') queryParams.append('status', filterStatus);
      if (searchTerm) queryParams.append('search', searchTerm);
      
      const response = await fetch(`http://localhost:5000/api/leave?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setLeaves(data);
      }
    } catch (err) {
      console.error('Failed to fetch leaves', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [refreshKey, filterStatus, searchTerm]);

  const updateStatus = async (id, status) => {
    const remarks = window.prompt(`Enter remarks for ${status === 'approved' ? 'approving' : 'rejecting'} this leave (optional):`);
    if (remarks === null) return; // User cancelled prompt

    try {
      const response = await fetch(`http://localhost:5000/api/leave/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status, remarks })
      });
      
      if (response.ok) {
        fetchLeaves();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge badge-approved">Approved</span>;
      case 'rejected': return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge badge-pending">Pending</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ height: 'fit-content' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>{userRole === 'student' ? 'My Leave History' : 'All Leave Requests'}</h3>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {userRole !== 'student' && (
            <input 
              type="text" 
              placeholder="Search names or reasons..." 
              className="input-field" 
              style={{ padding: '0.4rem 0.8rem', width: '200px', margin: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <select 
            className="input-field" 
            style={{ padding: '0.4rem 0.8rem', width: '130px', margin: 0, appearance: 'none', backgroundColor: '#0F0F12' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {userRole !== 'student' && <th>Student</th>}
              <th>Duration</th>
              <th>Details</th>
              <th>Status</th>
              {userRole !== 'student' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={userRole === 'student' ? 3 : 5} style={{ textAlign: 'center', padding: '2rem' }}>
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id} className="fade-up" style={{ animationDelay: '0.1s' }}>
                  {userRole !== 'student' && (
                    <td>
                      <div style={{ fontWeight: 500 }}>{leave.student_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>{leave.student_email}</div>
                    </td>
                  )}
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{leave.start_date}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{leave.end_date}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{leave.reason}</div>
                    {leave.remarks && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.25rem', padding: '0.25rem 0.5rem', background: 'var(--surface)', borderRadius: '4px', display: 'inline-block' }}>
                        Remarks: {leave.remarks}
                      </div>
                    )}
                  </td>
                  <td>{getStatusBadge(leave.status)}</td>
                  {userRole !== 'student' && (
                    <td>
                      {leave.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.4rem', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                            onClick={() => updateStatus(leave.id, 'approved')}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="btn btn-outline" 
                            style={{ padding: '0.4rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            onClick={() => updateStatus(leave.id, 'rejected')}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
