import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function LeaveForm({ onLeaveSubmitted }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setSuccess('Leave application submitted successfully!');
      setFormData({ startDate: '', endDate: '', reason: '' });
      if (onLeaveSubmitted) onLeaveSubmitted();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="glass-panel" style={{ height: 'fit-content' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={20} style={{ color: 'var(--accent)' }} /> 
        Apply for Leave
      </h3>
      
      {error && <div className="fade-up" style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
      {success && <div className="fade-up" style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Start Date</label>
            <input
              type="date"
              className="input-field"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              style={{ colorScheme: 'dark' }}
              required
            />
          </div>
          <div className="input-group">
            <label>End Date</label>
            <input
              type="date"
              className="input-field"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              style={{ colorScheme: 'dark' }}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Reason for Leave</label>
          <textarea
            className="input-field"
            rows="4"
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}
