import { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel fade-up stagger-1">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Bell size={20} style={{ color: 'var(--accent)' }} /> 
        Your Notifications
      </h3>
      
      {notifications.length === 0 ? (
        <div style={{ color: 'var(--foreground-muted)', padding: '2rem', textAlign: 'center' }}>
          You have no new notifications.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              style={{ 
                padding: '1.25rem', 
                background: notif.is_read ? 'var(--surface)' : 'rgba(94, 106, 210, 0.1)',
                border: notif.is_read ? '1px solid var(--border-default)' : '1px solid rgba(94, 106, 210, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ color: notif.is_read ? 'var(--foreground)' : '#fff', fontWeight: notif.is_read ? 400 : 500 }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginTop: '0.5rem' }}>
                  {new Date(notif.created_at).toLocaleString()}
                </div>
              </div>
              
              {!notif.is_read && (
                <button 
                  onClick={() => markAsRead(notif.id)}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <CheckCircle2 size={16} /> Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
