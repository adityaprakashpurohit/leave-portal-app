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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <LayoutDashboard className="text-primary" />
          <span>LeavePortal</span>
        </div>
        
        <div className="nav-links">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
            <User size={18} />
            <span>{user.name} ({user.role})</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your leave applications and history.</p>
        </div>

        {user.role === 'student' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              <LeaveForm onLeaveSubmitted={handleLeaveSubmitted} />
              <LeaveHistory userRole={user.role} refreshKey={refreshKey} />
            </div>
          </div>
        ) : (
          <div>
            <LeaveHistory userRole={user.role} refreshKey={refreshKey} />
          </div>
        )}
      </main>
    </div>
  );
}
