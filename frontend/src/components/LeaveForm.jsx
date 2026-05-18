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
    <div className="glass-panel">
      <h3>Apply for Leave</h3>
      
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Start Date</label>
            <input
              type="date"
              className="input-field"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
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

        <button type="submit" className="btn btn-primary">
          <Calendar size={18} /> Submit Application
        </button>
      </form>
    </div>
  );
}
