import React, { useState, useMemo } from 'react';
import LeaveCard from './LeaveCard';
import StatusBadge from './StatusBadge';
import { Search, Filter, Calendar, LayoutGrid, List, Download } from 'lucide-react';

export default function MyLeaveHistory({ applications = [], onCancelLeave }) {
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'

  const filteredApplications = useMemo(() => {
    return applications
      .filter(app => {
        const matchesSearch =
          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        const matchesType = typeFilter === 'All' || app.leaveType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.fromDate).getTime();
        const dateB = new Date(b.fromDate).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [applications, searchTerm, statusFilter, typeFilter, sortBy]);

  const handleExportCSV = () => {
    alert(`Exported ${filteredApplications.length} records to CSV format.`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls Bar */}
      <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">Leave History & Audit Log</h1>
            <p className="text-xs sm:text-sm text-slate mt-1">
              View all your submitted applications, tracking stages, and uploaded documents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-surface p-1 rounded-xl border border-hairline flex items-center">
              <button
                onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'card' ? 'bg-ink text-canvas font-medium shadow-2xs' : 'text-slate hover:text-ink'
                }`}
                title="Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-ink text-canvas font-medium shadow-2xs' : 'text-slate hover:text-ink'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-soft text-ink text-xs font-medium border border-hairline transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-stone" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="pt-4 border-t border-hairline grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, reason, type..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-surface border border-hairline text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-[10px] text-stone hover:text-ink font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved Only</option>
              <option value="Pending">Pending Only</option>
              <option value="Rejected">Rejected Only</option>
              <option value="Draft">Drafts Only</option>
            </select>
          </div>

          {/* Leave Type Filter Dropdown */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="All">All Leave Types</option>
              <option value="Medical">Medical Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Academic/Event">Academic / Event</option>
              <option value="Emergency">Emergency Leave</option>
              <option value="Personal">Personal Leave</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>

        </div>

        {/* Active filters status summary */}
        <div className="flex items-center justify-between text-[11px] text-stone pt-1">
          <span>Showing <strong className="text-ink font-semibold">{filteredApplications.length}</strong> of {applications.length} applications</span>
          {(statusFilter !== 'All' || typeFilter !== 'All' || searchTerm !== '') && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setTypeFilter('All');
                setSearchTerm('');
              }}
              className="text-primary-deep font-medium hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Rendering: Card or Table view */}
      {filteredApplications.length === 0 ? (
        <div className="bg-canvas rounded-2xl border border-hairline p-12 text-center max-w-md mx-auto my-6 space-y-3">
          <Filter className="w-8 h-8 text-stone mx-auto" />
          <h3 className="text-sm font-semibold text-ink">No records found</h3>
          <p className="text-xs text-stone">Try adjusting your search criteria or resetting the active filters.</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApplications.map(app => (
            <LeaveCard key={app.id} leave={app} onCancelLeave={onCancelLeave} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-canvas rounded-2xl border border-hairline shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-hairline text-[11px] font-semibold uppercase tracking-wider text-stone">
                  <th className="py-3 px-4">Ref ID & Type</th>
                  <th className="py-3 px-4">Date Range</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Approving Authority</th>
                  <th className="py-3 px-4">Attachment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-xs font-medium text-ink">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-surface/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-ink">{app.id}</div>
                      <StatusBadge status={app.leaveType} type="leaveType" size="xs" />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate">
                      <div>{app.fromDate}</div>
                      {app.fromDate !== app.toDate && <div className="text-[11px] text-stone">to {app.toDate}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {app.days} {app.days === 1 ? 'Day' : 'Days'}
                    </td>
                    <td className="py-3.5 px-4 text-slate truncate max-w-[160px]">
                      {app.authority}
                    </td>
                    <td className="py-3.5 px-4">
                      {app.documentName ? (
                        <span className="px-2 py-0.5 rounded bg-surface border border-hairline text-slate font-mono text-[10px] font-medium">
                          Attached
                        </span>
                      ) : (
                        <span className="text-stone text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <LeaveCard leave={app} onCancelLeave={onCancelLeave} compactButton={true} />
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
