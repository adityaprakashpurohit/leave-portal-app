import React, { useState } from 'react';
import { Bell, ShieldCheck, User, LogOut, Menu, Check, ChevronDown, GraduationCap, ArrowRightLeft } from 'lucide-react';

export default function Navbar({ student, currentRole, onRoleChange, onMobileMenuToggle, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [localNotifs, setLocalNotifs] = useState([
    {
      id: 1,
      title: 'Leave Request Approved',
      message: 'Your medical leave request (LV-2026-0412) has been approved by Dr. Vikram Mehta.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Mentor Verification Pending',
      message: 'Prof. Ananya Desai is reviewing your academic leave application.',
      time: 'Yesterday',
      unread: true
    },
    {
      id: 3,
      title: 'Quota Refreshed',
      message: 'Leave quota for Semester 6 has been updated.',
      time: '3 days ago',
      unread: false
    }
  ]);

  const unreadCount = localNotifs.filter(n => n.unread).length;

  const markAllRead = () => {
    setLocalNotifs(localNotifs.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-canvas border-b border-hairline shadow-2xs">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
        
        {/* Left: Mobile Menu Trigger + Brand/Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate hover:text-ink hover:bg-surface rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-teal-deep flex items-center justify-center text-primary shadow-2xs">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-sm font-semibold text-ink tracking-tight">
                Campus Leave Portal
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-stone bg-surface px-2 py-0.5 rounded border border-hairline">
                CSE Dept • Sem 6
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Authenticated Role Badge + Notifications + Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Static Authenticated Role Badge (No switching without logging out) */}
          <div className="flex items-center">
            {currentRole === 'hod' || currentRole === 'faculty' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffa42b]/15 text-[#c27913] border border-[#ffa42b]/30 font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffa42b] shrink-0" />
                <span className="hidden sm:inline">HOD Authority Desk</span>
                <span className="sm:hidden">HOD</span>
              </span>
            ) : currentRole === 'mentor' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f3727f]/15 text-[#d94856] border border-[#f3727f]/30 font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f3727f] shrink-0" />
                <span className="hidden sm:inline">Class Mentor Desk</span>
                <span className="sm:hidden">Mentor</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#539df5]/15 text-[#1f66be] border border-[#539df5]/30 font-semibold text-xs">
                <User className="w-3.5 h-3.5 text-[#539df5] shrink-0" />
                <span className="hidden sm:inline">Student Portal</span>
                <span className="sm:hidden">Student</span>
              </span>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate hover:text-ink hover:bg-surface transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-orange rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-canvas rounded-xl shadow-soft-lg border border-hairline p-3.5 z-50 animate-fade-in origin-top-right">
                <div className="flex items-center justify-between pb-2.5 border-b border-hairline mb-2.5">
                  <span className="font-semibold text-xs text-ink">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-brand-green-dark hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check className="w-3 h-3" /> Mark as read
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {localNotifs.length === 0 ? (
                    <p className="text-center text-stone py-4 text-xs">No notifications</p>
                  ) : (
                    localNotifs.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-lg text-left transition-colors ${
                          notif.unread ? 'bg-surface font-medium' : 'hover:bg-surface/60'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs text-ink">{notif.title}</p>
                          <span className="text-[10px] text-stone whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate mt-0.5 font-normal leading-relaxed">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface transition-colors focus:outline-none"
            >
              <img
                src={student?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                alt={student?.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-hairline-strong"
              />
              <div className="text-left hidden md:block pr-1">
                <div className="text-xs font-semibold text-ink leading-tight flex items-center gap-1">
                  {currentRole === 'hod' || currentRole === 'faculty' ? 'Dr. Vikram Mehta' : currentRole === 'mentor' ? 'Prof. Ananya Desai' : student?.name}
                  <ChevronDown className="w-3.5 h-3.5 text-stone" />
                </div>
                <div className="text-[11px] text-stone leading-tight">
                  {currentRole === 'hod' || currentRole === 'faculty' ? 'HOD • CSE' : currentRole === 'mentor' ? 'Class Mentor • CSE' : student?.rollNumber}
                </div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-canvas rounded-xl shadow-soft-lg border border-hairline py-1.5 px-1 z-50 animate-fade-in origin-top-right text-left">
                <div className="px-3 py-2 border-b border-hairline mb-1 sm:hidden">
                  <p className="font-semibold text-xs text-ink">{currentRole === 'hod' || currentRole === 'faculty' ? 'Dr. Vikram Mehta' : currentRole === 'mentor' ? 'Prof. Ananya Desai' : student?.name}</p>
                  <p className="text-[11px] text-stone">{currentRole === 'hod' || currentRole === 'faculty' ? 'HOD • CSE' : currentRole === 'mentor' ? 'Class Mentor • CSE' : student?.rollNumber}</p>
                </div>

                <div className="px-3 py-1.5 text-xs text-slate">
                  <span className="text-stone block text-[10px]">Authenticated Role</span>
                  <span className="font-semibold text-ink uppercase block mt-0.5">{currentRole} Access</span>
                </div>

                <div className="border-t border-hairline my-1 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate hover:text-accent-orange hover:bg-surface flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-accent-orange" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
