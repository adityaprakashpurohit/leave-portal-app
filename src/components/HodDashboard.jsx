import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Search, Filter, BarChart3, FileText, ArrowUpRight, AlertCircle, Building2, Download } from 'lucide-react';

export default function HodDashboard({ hod, applications = [], onApprove, onReject }) {
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('approvals'); // 'approvals' | 'analytics' | 'audit'

  // Filter applications for HOD review
  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* HOD Authority Header Card */}
      <div className="bg-ink text-canvas rounded-2xl p-6 sm:p-7 border border-hairline-dark shadow-2xs relative overflow-hidden">
        {/* Top Color Accent Strip for HOD Role (#ffa42b) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ffa42b] via-[#f3727f] to-[#539df5]" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ffa42b]/15 border border-[#ffa42b]/30 flex items-center justify-center text-[#ffa42b] shrink-0 shadow-2xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#ffa42b]/20 text-[#ffa42b] font-semibold text-[11px] border border-[#ffa42b]/30">
                  Head of Department Authority
                </span>
                <span className="text-xs text-stone">• Computer Science & Engineering</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-canvas mt-1 tracking-tight">
                HOD Executive Approval Desk
              </h1>
              <p className="text-xs sm:text-sm text-stone mt-1 max-w-xl">
                Final authorization desk for campus leave applications, gate passes, medical verification, and department attendance audits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 text-center sm:text-right">
              <span className="text-[10px] font-semibold text-stone uppercase block">Pending HOD Authorization</span>
              <span className="text-lg font-bold text-[#ffa42b]">{pendingCount} Requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for HOD Desk */}
      <div className="flex items-center gap-2 border-b border-hairline pb-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-[#ffa42b] text-white shadow-2xs'
              : 'bg-canvas text-slate hover:bg-surface border border-hairline'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Final Authorization Queue ({pendingCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-[#ffa42b] text-white shadow-2xs'
              : 'bg-canvas text-slate hover:bg-surface border border-hairline'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Department Leave Analytics</span>
        </button>
      </div>

      {/* Tab 1: Final Authorization Queue */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          
          {/* Quick Stats & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setFilterStatus('Pending')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                filterStatus === 'Pending' ? 'bg-[#ffa42b]/10 border-[#ffa42b]' : 'bg-canvas border-hairline hover:border-hairline-strong'
              }`}
            >
              <div>
                <span className="text-stone font-semibold text-xs uppercase tracking-wider block">Needs HOD Approval</span>
                <span className="text-2xl font-bold text-ink mt-1 block">{pendingCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ffa42b]/15 flex items-center justify-center text-[#ffa42b]">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div
              onClick={() => setFilterStatus('Approved')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                filterStatus === 'Approved' ? 'bg-[#539df5]/10 border-[#539df5]' : 'bg-canvas border-hairline hover:border-hairline-strong'
              }`}
            >
              <div>
                <span className="text-stone font-semibold text-xs uppercase tracking-wider block">Authorized Gate Passes</span>
                <span className="text-2xl font-bold text-ink mt-1 block">{approvedCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#539df5]/15 flex items-center justify-center text-[#539df5]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div
              onClick={() => setFilterStatus('Rejected')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                filterStatus === 'Rejected' ? 'bg-[#f3727f]/10 border-[#f3727f]' : 'bg-canvas border-hairline hover:border-hairline-strong'
              }`}
            >
              <div>
                <span className="text-stone font-semibold text-xs uppercase tracking-wider block">Declined Applications</span>
                <span className="text-2xl font-bold text-ink mt-1 block">{rejectedCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#f3727f]/15 flex items-center justify-center text-[#f3727f]">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-canvas p-3 sm:p-4 rounded-2xl border border-hairline flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-stone absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search student roll number, name, ID or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl text-xs text-ink placeholder:text-stone border border-hairline focus:outline-none focus:ring-2 focus:ring-[#ffa42b]/50"
              />
            </div>
            <span className="text-xs text-stone font-medium self-end sm:self-center">
              Showing <strong className="text-ink">{filteredApplications.length}</strong> department requests
            </span>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-canvas rounded-2xl border border-hairline p-12 text-center shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center mx-auto text-stone mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-ink">No department leave requests found</h3>
              <p className="text-xs text-stone mt-1 max-w-sm mx-auto">
                All department leave applications have been processed or no requests match the filter criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-canvas rounded-2xl p-5 border border-hairline shadow-2xs hover:border-hairline-strong transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-surface px-2.5 py-1 rounded-md border border-hairline text-ink">
                        {app.id}
                      </span>
                      <span className="font-bold text-sm text-ink">{app.studentName}</span>
                      <span className="text-xs font-mono text-stone bg-surface px-2 py-0.5 rounded border border-hairline">
                        {app.rollNumber}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate">
                      <span className="font-semibold text-ink bg-surface-soft px-2 py-0.5 rounded">
                        {app.leaveType} Leave ({app.days} {app.days === 1 ? 'Day' : 'Days'})
                      </span>
                      <span>•</span>
                      <span>From <strong className="text-ink">{app.fromDate}</strong> to <strong className="text-ink">{app.toDate}</strong></span>
                      <span>•</span>
                      <span className="text-stone">Mentor Status: Verified & Recommended</span>
                    </div>

                    <p className="text-xs text-slate bg-surface p-2.5 rounded-lg border border-hairline leading-relaxed max-w-2xl">
                      <strong className="text-ink font-semibold">Student Reason:</strong> {app.reason}
                    </p>
                  </div>

                  {/* HOD Final Actions */}
                  {app.status === 'Pending' ? (
                    <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-hairline">
                      <button
                        onClick={() => onApprove(app.id)}
                        className="px-4 py-2 rounded-xl bg-[#ffa42b] hover:bg-[#e8921a] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorize & Issue Pass</span>
                      </button>
                      <button
                        onClick={() => onReject(app.id, 'Declined by HOD due to department policy / scheduled exams.')}
                        className="px-4 py-2 rounded-xl bg-[#f3727f]/15 hover:bg-[#f3727f]/25 text-[#f3727f] border border-[#f3727f]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline Request</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-stone block font-medium">Final HOD Authorization</span>
                      <span className="text-xs font-semibold text-ink uppercase mt-0.5 block">{app.status}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Department Leave Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quota Burn Card */}
          <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div>
                <h3 className="text-sm font-bold text-ink">Department Quota Burn Rate</h3>
                <p className="text-xs text-stone">Semester 6 CSE leave consumption breakdown</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#539df5]/15 text-[#539df5] font-semibold font-mono text-xs">
                24.2% Average
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-ink">Casual Leaves (CL)</span>
                  <span className="font-mono text-stone">340 / 1200 Days Used</span>
                </div>
                <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden border border-hairline">
                  <div className="bg-[#539df5] h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-ink">Medical Leaves (ML)</span>
                  <span className="font-mono text-stone">180 / 1440 Days Used</span>
                </div>
                <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden border border-hairline">
                  <div className="bg-[#ffa42b] h-full rounded-full" style={{ width: '13%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-ink">Emergency / Duty Leaves (EL/DL)</span>
                  <span className="font-mono text-stone">95 / 600 Days Used</span>
                </div>
                <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden border border-hairline">
                  <div className="bg-[#f3727f] h-full rounded-full" style={{ width: '16%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Audit & Compliance Card */}
          <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div>
                  <h3 className="text-sm font-bold text-ink">Department Compliance Audit</h3>
                  <p className="text-xs text-stone">Medical certificates and gate pass verification</p>
                </div>
                <Building2 className="w-5 h-5 text-stone" />
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-hairline flex items-center justify-between">
                  <span className="font-medium text-ink">Pending Medical Certificate Audits</span>
                  <span className="font-mono font-bold text-[#ffa42b] bg-[#ffa42b]/15 px-2 py-0.5 rounded">4 Files</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-hairline flex items-center justify-between">
                  <span className="font-medium text-ink">Active Student Gate Passes Today</span>
                  <span className="font-mono font-bold text-[#539df5] bg-[#539df5]/15 px-2 py-0.5 rounded">12 Passes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert("Comprehensive HOD Department Audit Report (PDF/CSV) generated.")}
              className="w-full py-3 rounded-xl bg-ink text-canvas font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-2xs mt-4"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Semester Audit Report</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
