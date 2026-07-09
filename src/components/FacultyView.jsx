import React, { useState } from 'react';
import LeaveCard from './LeaveCard';
import StatusBadge from './StatusBadge';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, Filter, UserCheck } from 'lucide-react';

export default function FacultyView({ applications = [], onApprove, onReject, onRoleChange }) {
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [authorityFilter, setAuthorityFilter] = useState('All');

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAuth = authorityFilter === 'All' || app.authority.includes(authorityFilter);

    return matchesStatus && matchesSearch && matchesAuth;
  });

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Faculty Header */}
      <div className="bg-ink text-canvas rounded-2xl p-6 sm:p-7 border border-hairline-dark shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-canvas/10 border border-white/10 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-accent-orange/20 text-accent-orange font-semibold text-[11px] border border-accent-orange/30">
                  Authority Desk
                </span>
                <span className="text-xs text-stone">• CSE Department</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-canvas mt-1 tracking-tight">
                Faculty & Admin Approval Portal
              </h1>
              <p className="text-xs sm:text-sm text-stone mt-1 max-w-xl">
                Review pending student leave requests, check medical certificates, and authorize gate passes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 text-center sm:text-right">
              <span className="text-[10px] font-semibold text-stone uppercase block">Pending Review</span>
              <span className="text-lg font-bold text-accent-orange">{pendingCount} Requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilterStatus('Pending')}
          className={`p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between ${
            filterStatus === 'Pending' ? 'bg-accent-orange/10 border-accent-orange' : 'bg-canvas border-hairline hover:border-hairline-strong'
          }`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-orange">Pending Review</span>
            <p className="text-2xl font-bold text-ink mt-1">{pendingCount}</p>
            <p className="text-[11px] text-stone mt-0.5">Requires authority clearance</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-orange/15 text-accent-orange flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('Approved')}
          className={`p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between ${
            filterStatus === 'Approved' ? 'bg-brand-green/15 border-brand-green-dark' : 'bg-canvas border-hairline hover:border-hairline-strong'
          }`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-green-dark">Approved</span>
            <p className="text-2xl font-bold text-ink mt-1">{approvedCount}</p>
            <p className="text-[11px] text-stone mt-0.5">Authorized for attendance</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-green/20 text-brand-green-dark flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div
          onClick={() => setFilterStatus('Rejected')}
          className={`p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between ${
            filterStatus === 'Rejected' ? 'bg-surface-soft border-slate' : 'bg-canvas border-hairline hover:border-hairline-strong'
          }`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">Declined</span>
            <p className="text-2xl font-bold text-ink mt-1">{rejectedCount}</p>
            <p className="text-[11px] text-stone mt-0.5">Not excused / incomplete proof</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface border border-hairline text-slate flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Review Queue */}
      <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-ink">Student Applications Queue</h2>
            <p className="text-xs text-slate mt-0.5">Filter and process applications assigned to your desk</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-ink text-canvas font-semibold shadow-2xs'
                    : 'bg-surface text-slate hover:bg-surface-soft border border-hairline'
                }`}
              >
                {st} {st !== 'All' && `(${applications.filter(a => a.status === st).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Authority Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student name, roll number, reason or ID..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-hairline text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <select
              value={authorityFilter}
              onChange={(e) => setAuthorityFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">All Approving Authorities</option>
              <option value="HOD">Assigned to HOD (Dr. Vikram Mehta)</option>
              <option value="Mentor">Assigned to Class Mentor (Prof. Ananya Desai)</option>
              <option value="Warden">Assigned to Hostel Warden (Mr. Suresh Rao)</option>
            </select>
          </div>
        </div>

        {/* Render Cards Grid */}
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-surface border border-hairline max-w-md mx-auto my-6 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-stone mx-auto" />
            <h3 className="text-sm font-semibold text-ink">Queue is Empty</h3>
            <p className="text-xs text-stone">There are no {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} requests matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {filteredApplications.map(app => (
              <LeaveCard
                key={app.id}
                leave={app}
                isFacultyView={true}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
