import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LeaveForm from './components/LeaveForm';
import MyLeaveHistory from './components/MyLeaveHistory';
import Profile from './components/Profile';
import FacultyView from './components/FacultyView';
import MentorDashboard from './components/MentorDashboard';
import HodDashboard from './components/HodDashboard';
import LoginSignup from './components/LoginSignup';
import { MOCK_STUDENTS, INITIAL_LEAVE_APPLICATIONS } from './data/mockData';

export default function App() {
  // Global Application State
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication determines role from credentials
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'mentor' | 'hod' | 'faculty'

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'apply' | 'history' | 'profile' | 'mentor-dashboard' | 'hod-dashboard' | 'faculty-dashboard'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [student, setStudent] = useState(MOCK_STUDENTS[0]);
  const [applications, setApplications] = useState(INITIAL_LEAVE_APPLICATIONS);

  // Handlers
  const handleLogin = (loginData) => {
    setIsLoggedIn(true);
    if (loginData?.role === 'hod' || loginData?.role === 'faculty') {
      setCurrentRole('hod');
      setActiveTab('hod-dashboard');
    } else if (loginData?.role === 'mentor') {
      setCurrentRole('mentor');
      setActiveTab('mentor-dashboard');
    } else {
      setCurrentRole('student');
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'hod' || newRole === 'faculty') {
      setActiveTab('hod-dashboard');
    } else if (newRole === 'mentor') {
      setActiveTab('mentor-dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleSubmitLeave = (newApplication) => {
    // Add to applications state at the top
    setApplications(prev => [newApplication, ...prev]);

    // Update used quota if Casual, Medical, or Emergency
    const type = newApplication.leaveType;
    if (student.leaveBalances[type]) {
      setStudent(prev => {
        const currentBal = prev.leaveBalances[type];
        const newUsed = currentBal.used + newApplication.days;
        const newRemaining = Math.max(0, currentBal.total - newUsed);
        return {
          ...prev,
          leaveBalances: {
            ...prev.leaveBalances,
            [type]: {
              ...currentBal,
              used: newUsed,
              remaining: newRemaining
            }
          }
        };
      });
    }

    // Redirect to Dashboard or History after brief delay
    setTimeout(() => {
      setActiveTab('history');
    }, 1500);
  };

  const handleSaveDraft = (draftApplication) => {
    setApplications(prev => [draftApplication, ...prev]);
  };

  const handleCancelLeave = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleApproveLeave = (id) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        return {
          ...app,
          status: 'Approved',
          timeline: app.timeline.map((st, idx) => {
            if (st.stage === 'Mentor Approved' || st.stage === 'HOD Approved') {
              return { ...st, status: 'completed', timestamp: nowStr, note: 'Approved via Faculty Desk.' };
            }
            return st;
          })
        };
      })
    );
  };

  const handleRejectLeave = (id, remark = 'Declined due to scheduled department assessment.') => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        const nowStr = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        return {
          ...app,
          status: 'Rejected',
          timeline: app.timeline.map((st, idx) => {
            if (st.stage === 'Mentor Approved' || st.stage === 'HOD Approved') {
              return { ...st, status: idx === 1 ? 'completed' : 'rejected', timestamp: nowStr, note: remark };
            }
            return st;
          })
        };
      })
    );
  };

  if (!isLoggedIn) {
    return <LoginSignup onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-ink">
      
      {/* Top Navbar */}
      <Navbar
        student={student}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        onLogout={handleLogout}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Content Area with responsive padding for mobile bottom bar */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          
          {activeTab === 'dashboard' && (
            <Dashboard
              student={student}
              applications={applications}
              onApplyClick={() => setActiveTab('apply')}
              onCancelLeave={handleCancelLeave}
            />
          )}

          {activeTab === 'apply' && (
            <LeaveForm
              student={student}
              onSubmitLeave={handleSubmitLeave}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {activeTab === 'history' && (
            <MyLeaveHistory
              applications={applications}
              onCancelLeave={handleCancelLeave}
            />
          )}

          {activeTab === 'profile' && (
            <Profile student={student} />
          )}

          {activeTab === 'mentor-dashboard' && (
            <MentorDashboard
              mentor={{
                name: student.name === 'Aarav Sharma' ? 'Prof. Ananya Desai' : student.name,
                title: 'Class Mentor • CSE Batch 2024–28 (Section B)',
                email: 'ananya.desai@faculty.college.edu',
                department: 'Computer Science & Engineering',
                photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
              }}
              applications={applications}
              onVerifyMentor={(id) => handleApproveLeave(id)}
              onRejectMentor={(id, remark) => handleRejectLeave(id, remark)}
            />
          )}

          {(activeTab === 'hod-dashboard' || activeTab === 'faculty-dashboard') && (
            <HodDashboard
              hod={{
                name: student.name === 'Aarav Sharma' ? 'Dr. Vikram Mehta' : student.name,
                title: 'Head of Department (HOD) • CSE Department',
                email: 'vikram.mehta@faculty.college.edu',
                department: 'Computer Science & Engineering',
                photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300'
              }}
              applications={applications}
              onApprove={handleApproveLeave}
              onReject={handleRejectLeave}
            />
          )}

        </main>
      </div>

    </div>
  );
}
