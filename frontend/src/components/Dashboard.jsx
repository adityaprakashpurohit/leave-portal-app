import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import LeaveForm from './LeaveForm';
import LeaveHistory from './LeaveHistory';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleLeaveSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <nav className="nav-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600', fontSize: '1.25rem' }}>
          <LayoutDashboard style={{ color: 'var(--accent)' }} size={22} />
          <span>LeavePortal</span>
        </div>
        
        <div className="nav-links">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', color: 'var(--foreground-muted)' }}>
            <User size={18} />
            <span style={{ fontSize: '0.9rem' }}>{user.name} <span style={{ opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>({user.role})</span></span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="container">
        <div className="fade-up" style={{ marginBottom: '3rem', marginTop: '1rem' }}>
          <h1>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Manage your leave applications and history.</p>
        </div>

        {user.role === 'student' ? (
          <div className="stagger-1 fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            <LeaveForm onLeaveSubmitted={handleLeaveSubmitted} />
            <LeaveHistory userRole={user.role} refreshKey={refreshKey} />
          </div>
        ) : (
          <div className="stagger-1 fade-up">
            <LeaveHistory userRole={user.role} refreshKey={refreshKey} />
          </div>
        )}
      </main>
    </div>
  );
}
