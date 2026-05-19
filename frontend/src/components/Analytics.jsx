import { useState, useEffect } from 'react';
import { BarChart, PieChart, Users, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Analytics() {
  const [data, setData] = useState({
    totalLeaves: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    departmentWise: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/analytics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="fade-up stagger-1">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BarChart size={20} style={{ color: 'var(--accent)' }} /> 
        Platform Analytics
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-muted)', marginBottom: '0.5rem' }}>
            <FileText size={16} /> Total Leaves
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>{data.totalLeaves}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>
            <Clock size={16} /> Pending
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>{data.pending}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
            <CheckCircle size={16} /> Approved
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>{data.approved}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>
            <XCircle size={16} /> Rejected
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>{data.rejected}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={18} /> Department Reports
        </h4>
        {data.departmentWise.length === 0 ? (
          <div style={{ color: 'var(--foreground-muted)' }}>No department data available.</div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.departmentWise.map((dept, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={16} style={{ color: 'var(--accent)' }} />
                  <span>{dept.name}</span>
                </div>
                <div style={{ fontWeight: 600 }}>{dept.count} requests</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
