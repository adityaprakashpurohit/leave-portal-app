import { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';

export default function LeaveHistory({ userRole, refreshKey }) {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leave', {
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
  }, [refreshKey]);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leave/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
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
    <div className="glass-panel">
      <h3>{userRole === 'student' ? 'My Leave History' : 'All Leave Requests'}</h3>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {userRole !== 'student' && <th>Student</th>}
              <th>Duration</th>
              <th>Reason</th>
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
                <tr key={leave.id}>
                  {userRole !== 'student' && (
                    <td>
                      <div>{leave.student_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{leave.student_email}</div>
                    </td>
                  )}
                  <td>
                    <div>{leave.start_date} to</div>
                    <div>{leave.end_date}</div>
                  </td>
                  <td>{leave.reason}</td>
                  <td>{getStatusBadge(leave.status)}</td>
                  {userRole !== 'student' && (
                    <td>
                      {leave.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem', background: 'var(--success)' }}
                            onClick={() => updateStatus(leave.id, 'approved')}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem', background: 'var(--danger)' }}
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
