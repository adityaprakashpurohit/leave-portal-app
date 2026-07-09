import React from 'react';
import { LayoutDashboard, FilePlus, History, User, ShieldCheck, ChevronRight, X, ArrowRightLeft } from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange, currentRole, onRoleChange, mobileOpen, onMobileClose }) {
  const navItems = [
    // Student items
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard, role: 'student' },
    { id: 'apply', label: 'Apply for Leave', icon: FilePlus, role: 'student' },
    { id: 'history', label: 'Leave History', icon: History, role: 'student' },
    { id: 'profile', label: 'My Profile', icon: User, role: 'student' },

    // Class Mentor items
    { id: 'mentor-dashboard', label: 'Class Mentor Desk', icon: ShieldCheck, role: 'mentor', badge: 'Mentor' },

    // HOD / Authority items
    { id: 'hod-dashboard', label: 'HOD Executive Desk', icon: ShieldCheck, role: 'hod', badge: 'HOD' },
    { id: 'faculty-dashboard', label: 'Approval Desk', icon: ShieldCheck, role: 'faculty', badge: 'Faculty' }
  ];

  const filteredItems = navItems.filter(
    item => item.role === currentRole || (currentRole === 'faculty' && item.role === 'hod')
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-brand-teal-deep text-on-dark flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary text-on-primary font-bold flex items-center justify-center text-sm">
              CL
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-on-dark block leading-snug">
                Leave Portal
              </span>
              <span className="text-[11px] text-on-dark-muted block leading-none">University Campus</span>
            </div>
          </div>

          <button
            onClick={onMobileClose}
            className="lg:hidden p-1 text-on-dark-muted hover:text-on-dark rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-on-dark-muted mb-2">
            Menu
          </p>

          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (activeTab === 'dashboard' && item.id === 'dashboard' && currentRole === 'student') || 
              (activeTab === 'mentor-dashboard' && item.id === 'mentor-dashboard' && currentRole === 'mentor') ||
              ((activeTab === 'hod-dashboard' || activeTab === 'faculty-dashboard') && (item.id === 'hod-dashboard' || item.id === 'faculty-dashboard') && (currentRole === 'hod' || currentRole === 'faculty'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onMobileClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'text-on-dark-muted hover:text-on-dark hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    isActive ? 'bg-on-primary/15 text-on-primary' : 'bg-white/10 text-on-dark'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Quota Overview for Students */}
        {currentRole === 'student' && (
          <div className="p-3.5 mx-3 mb-3 rounded-lg bg-white/5 border border-white/10 text-left">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-on-dark">Leave Quota</span>
              <span className="text-primary font-semibold">21 / 27 Days</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-primary h-full rounded-full" style={{ width: '77%' }} />
            </div>
          </div>
        )}

        {/* Bottom Badge for Mentor / HOD */}
        {currentRole === 'mentor' && (
          <div className="p-3.5 mx-3 mb-3 rounded-lg bg-[#f3727f]/15 border border-[#f3727f]/30 text-left">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-on-dark">Assigned Batch</span>
              <span className="text-[#f3727f] font-semibold text-[11px]">Sec B (2024–28)</span>
            </div>
            <span className="text-[10px] text-on-dark-muted block mt-0.5">Academic Adviser Portal</span>
          </div>
        )}

        {currentRole === 'hod' && (
          <div className="p-3.5 mx-3 mb-3 rounded-lg bg-[#ffa42b]/15 border border-[#ffa42b]/30 text-left">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-on-dark">Department Desk</span>
              <span className="text-[#ffa42b] font-semibold text-[11px]">CSE Dept</span>
            </div>
            <span className="text-[10px] text-on-dark-muted block mt-0.5">Executive Approval Authority</span>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-white/10 text-center">
          <p className="text-[11px] text-on-dark-muted">
            Academic Session 2025–26
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-canvas border-t border-hairline flex items-center justify-around h-16 lg:hidden px-2">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || 
            (activeTab === 'dashboard' && item.id === 'dashboard' && currentRole === 'student') || 
            (activeTab === 'mentor-dashboard' && item.id === 'mentor-dashboard' && currentRole === 'mentor') ||
            ((activeTab === 'hod-dashboard' || activeTab === 'faculty-dashboard') && (item.id === 'hod-dashboard' || item.id === 'faculty-dashboard') && (currentRole === 'hod' || currentRole === 'faculty'));

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive ? 'text-primary-deep font-semibold' : 'text-stone hover:text-ink'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
