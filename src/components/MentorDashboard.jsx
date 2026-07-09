import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Award, CheckCircle2, XCircle, Clock, Search, Filter, AlertTriangle, Users, FileCheck, ArrowUpRight, MessageSquare, ShieldAlert } from 'lucide-react';

export default function MentorDashboard({ mentor, applications = [], onVerifyMentor, onRejectMentor }) {
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'watchlist' | 'reports'

  // Filter applications relevant for Mentor verification
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
  const verifiedCount = applications.filter(a => a.status === 'Approved').length;

  // Mock batch students for Mentor attendance watchlist
  const [batchStudents] = useState([
    { id: '2024CS1089', name: 'Aarav Sharma', attendance: 86, leavesTaken: 3, status: 'Good Standing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
    { id: '2024CS1092', name: 'Rhea Nair', attendance: 72, leavesTaken: 6, status: 'Attendance Warning (<75%)', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
    { id: '2024CS1104', name: 'Kabeer Verma', attendance: 91, leavesTaken: 1, status: 'Good Standing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { id: '2024CS1118', name: 'Sneha Patel', attendance: 68, leavesTaken: 8, status: 'Critical Shortage (<70%)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
    { id: '2024CS1125', name: 'Devashish Rao', attendance: 82, leavesTaken: 4, status: 'Good Standing', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' }
  ]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Class Mentor Header Card */}
      <div className="bg-ink text-canvas rounded-2xl p-6 sm:p-7 border border-hairline-dark shadow-2xs relative overflow-hidden">
        {/* Top Color Accent Strip for Mentor Role (#f3727f) */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f3727f] via-[#ffa42b] to-[#539df5]" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#f3727f]/15 border border-[#f3727f]/30 flex items-center justify-center text-[#f3727f] shrink-0 shadow-2xs">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#f3727f]/20 text-[#f3727f] font-semibold text-[11px] border border-[#f3727f]/30">
                  Class Mentor Desk
                </span>
                <span className="text-xs text-stone">• CSE Batch 2024–28 (Sec B)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-canvas mt-1 tracking-tight">
                Academic Mentor Verification Portal
              </h1>
              <p className="text-xs sm:text-sm text-stone mt-1 max-w-xl">
                Review class leave requests, monitor student attendance quotas, and forward verified applications to the HOD.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 text-center sm:text-right">
              <span className="text-[10px] font-semibold text-stone uppercase block">Pending Mentor Review</span>
              <span className="text-lg font-bold text-[#f3727f]">{pendingCount} Requests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Mentor Desk */}
      <div className="flex items-center gap-2 border-b border-hairline pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'bg-[#f3727f] text-white shadow-2xs'
              : 'bg-canvas text-slate hover:bg-surface border border-hairline'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Verification Queue ({pendingCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'watchlist'
              ? 'bg-[#f3727f] text-white shadow-2xs'
              : 'bg-canvas text-slate hover:bg-surface border border-hairline'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Batch Attendance Watchlist</span>
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          
          {/* Quick Stats & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setFilterStatus('Pending')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                filterStatus === 'Pending' ? 'bg-[#f3727f]/10 border-[#f3727f]' : 'bg-canvas border-hairline hover:border-hairline-strong'
              }`}
            >
              <div>
                <span className="text-stone font-semibold text-xs uppercase tracking-wider block">Needs Verification</span>
                <span className="text-2xl font-bold text-ink mt-1 block">{pendingCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#f3727f]/15 flex items-center justify-center text-[#f3727f]">
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
                <span className="text-stone font-semibold text-xs uppercase tracking-wider block">Verified & Forwarded</span>
                <span className="text-2xl font-bold text-ink mt-1 block">{verifiedCount}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#539df5]/15 flex items-center justify-center text-[#539df5]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div
              onClick={() => setFilterStatus('All')}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                filterStatus === 'All' ? 'bg-surface border-hairline-strong font-semibold' : 'bg-canvas border-hairline hover:border-hairline-strong'
              }`}
            >
              <div>
                <span className="text-stone font-semibold text-xs uppercase tracking-wider block">Total Applications</span>
                <span className="text-2xl font-bold text-ink mt-1 block">{applications.length}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-soft border border-hairline flex items-center justify-center text-slate">
                <Filter className="w-5 h-5" />
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
                className="w-full pl-10 pr-4 py-2 bg-surface rounded-xl text-xs text-ink placeholder:text-stone border border-hairline focus:outline-none focus:ring-2 focus:ring-[#f3727f]/50"
              />
            </div>
            <span className="text-xs text-stone font-medium self-end sm:self-center">
              Showing <strong className="text-ink">{filteredApplications.length}</strong> batch records
            </span>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div className="bg-canvas rounded-2xl border border-hairline p-12 text-center shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center mx-auto text-stone mb-3">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-ink">No batch leave requests found</h3>
              <p className="text-xs text-stone mt-1 max-w-sm mx-auto">
                All applications assigned to your mentoring section have been verified or no requests match the filter criteria.
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
                      <span className="text-stone">Applied: {app.appliedOn}</span>
                    </div>

                    <p className="text-xs text-slate bg-surface p-2.5 rounded-lg border border-hairline leading-relaxed max-w-2xl">
                      <strong className="text-ink font-semibold">Student Justification:</strong> {app.reason}
                    </p>
                  </div>

                  {/* Mentor Verification Actions */}
                  {app.status === 'Pending' ? (
                    <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-hairline">
                      <button
                        onClick={() => onVerifyMentor ? onVerifyMentor(app.id) : alert('Application verified by Mentor and forwarded to HOD.')}
                        className="px-4 py-2 rounded-xl bg-[#539df5] hover:bg-[#3d89e2] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify & Forward to HOD</span>
                      </button>
                      <button
                        onClick={() => onRejectMentor ? onRejectMentor(app.id, 'Declined by Class Mentor due to academic assessment shortage.') : alert('Application rejected by Class Mentor.')}
                        className="px-4 py-2 rounded-xl bg-[#f3727f]/15 hover:bg-[#f3727f]/25 text-[#f3727f] border border-[#f3727f]/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Clarify / Decline</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-stone block font-medium">Mentor Action Taken</span>
                      <span className="text-xs font-semibold text-ink uppercase mt-0.5 block">{app.status}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Batch Attendance Watchlist */}
      {activeTab === 'watchlist' && (
        <div className="bg-canvas rounded-2xl border border-hairline shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-ink">Section B Student Attendance & Defaulter Watchlist</h3>
              <p className="text-xs text-stone mt-0.5">Students with attendance below 75% require mandatory mentor verification before medical or casual leave approval.</p>
            </div>
            <button
              onClick={() => alert("Batch attendance summary exported as CSV.")}
              className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-soft border border-hairline text-xs font-semibold text-ink flex items-center gap-1.5 self-start sm:self-center"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-stone" />
              <span>Export Batch Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-hairline text-stone font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student Name & Roll No</th>
                  <th className="py-3 px-4">Attendance %</th>
                  <th className="py-3 px-4">Leaves Taken</th>
                  <th className="py-3 px-4">Academic Status</th>
                  <th className="py-3 px-4 text-right">Mentor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {batchStudents.map(student => (
                  <tr key={student.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-ink flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-hairline" />
                      <div>
                        <div className="font-bold text-ink">{student.name}</div>
                        <div className="text-[11px] font-mono text-stone">{student.id}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold font-mono px-2 py-1 rounded-md border ${
                        student.attendance < 75 ? 'bg-[#f3727f]/15 text-[#f3727f] border-[#f3727f]/30' : 'bg-surface text-ink border-hairline'
                      }`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate">{student.leavesTaken} Days</td>
                    <td className="py-3.5 px-4">
                      {student.attendance < 75 ? (
                        <span className="inline-flex items-center gap-1 text-[#f3727f] font-semibold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {student.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-brand-green-dark font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {student.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Attendance notice dispatched to ${student.name} (${student.id}).`)}
                        className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-soft border border-hairline font-semibold text-xs text-ink transition-colors"
                      >
                        Send Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
