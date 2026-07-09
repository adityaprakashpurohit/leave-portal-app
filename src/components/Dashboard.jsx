import React, { useState } from 'react';
import LeaveCard from './LeaveCard';
import StatusBadge from './StatusBadge';
import { PlusCircle, Calendar, CheckCircle2, Clock, XCircle, Filter, RefreshCw, FilePlus, AlertCircle, ArrowRight } from 'lucide-react';

export default function Dashboard({ student, applications = [], onApplyClick, onCancelLeave }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [showSkeleton, setShowSkeleton] = useState(false);

  const balances = student?.leaveBalances || {
    Casual: { total: 10, used: 0, remaining: 10, color: 'accent-purple' },
    Medical: { total: 12, used: 0, remaining: 12, color: 'accent-blue' },
    Emergency: { total: 5, used: 0, remaining: 5, color: 'accent-pink' }
  };


  const filteredApps = applications.filter(app => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  const totalUsed = Object.values(balances).reduce((acc, curr) => acc + curr.used, 0);
  const totalQuota = Object.values(balances).reduce((acc, curr) => acc + curr.total, 0);

  const handleSimulateLoading = () => {
    setShowSkeleton(true);
    setTimeout(() => {
      setShowSkeleton(false);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome / Overview Bar */}
      <div className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={student?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={student?.name}
              className="w-14 h-14 rounded-full object-cover ring-1 ring-hairline-strong shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  {student?.name}
                </h1>
                <span className="text-xs font-mono text-stone bg-surface px-2 py-0.5 rounded border border-hairline">
                  {student?.rollNumber}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate mt-1">
                {student?.course} • {student?.semester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSimulateLoading}
              className="p-2.5 rounded-xl bg-surface hover:bg-surface-soft text-slate hover:text-ink text-xs font-medium transition-colors border border-hairline flex items-center gap-1.5"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${showSkeleton ? 'animate-spin text-primary-deep' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={onApplyClick}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-deep text-on-primary font-semibold text-xs sm:text-sm transition-colors shadow-2xs flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota Cards */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
            Leave Balances
          </h2>
          <span className="text-xs text-stone">
            Total remaining: <strong className="text-ink">{totalQuota - totalUsed} of {totalQuota} days</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(balances).map(([type, data]) => {
            const percentRemaining = Math.round((data.remaining / data.total) * 100);
            const isLow = percentRemaining <= 30;

            const badgeClasses = {
              Casual: 'bg-accent-purple/15 text-accent-purple border-accent-purple/20',
              Medical: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
              Emergency: 'bg-accent-pink/15 text-accent-pink border-accent-pink/20'
            }[type] || 'bg-brand-green/20 text-brand-green-dark border-brand-green/30';

            const barColor = {
              Casual: 'bg-accent-purple',
              Medical: 'bg-accent-blue',
              Emergency: 'bg-accent-pink'
            }[type] || 'bg-brand-green';

            return (
              <div
                key={type}
                onClick={onApplyClick}
                className="bg-canvas p-5 rounded-2xl border border-hairline hover:border-hairline-strong transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}>
                      {type}
                    </span>
                    <span className="text-xs text-stone font-mono">
                      {data.used}/{data.total} used
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <div>
                      <span className="text-2xl font-bold text-ink tracking-tight">{data.remaining}</span>
                      <span className="text-xs text-stone ml-1.5">days left</span>
                    </div>
                    {isLow && (
                      <span className="text-[10px] font-semibold text-accent-orange bg-semantic-warning-bg px-2 py-0.5 rounded border border-semantic-warning-text/20">
                        Low
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-surface-soft h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${percentRemaining}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone mt-4 pt-3 border-t border-hairline/60">
                  <span>{percentRemaining}% available</span>
                  <span className="text-primary-deep group-hover:underline font-medium flex items-center gap-0.5">
                    Apply <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Applications Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">Recent Applications</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-ink text-canvas font-semibold'
                    : 'bg-surface text-slate hover:bg-surface-soft border border-hairline'
                }`}
              >
                {st} {st !== 'All' && `(${applications.filter(a => a.status === st).length})`}
              </button>
            ))}
          </div>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((sk) => (
              <div key={sk} className="bg-canvas p-5 rounded-xl border border-hairline space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-20 h-4 bg-surface-soft rounded" />
                  <div className="w-16 h-4 bg-surface-soft rounded-full" />
                </div>
                <div className="w-2/3 h-4 bg-surface-soft rounded" />
                <div className="w-full h-10 bg-surface-soft rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-canvas rounded-2xl border border-hairline p-10 text-center max-w-md mx-auto my-6 space-y-3">
            <Calendar className="w-8 h-8 text-stone mx-auto stroke-[1.5]" />
            <h3 className="text-sm font-semibold text-ink">No {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''} applications</h3>
            <p className="text-xs text-stone">
              {filterStatus === 'All'
                ? 'You have no leave applications yet.'
                : `No requests currently match the "${filterStatus}" status.`}
            </p>
            {filterStatus !== 'All' && (
              <button
                onClick={() => setFilterStatus('All')}
                className="px-3.5 py-1.5 rounded-lg bg-surface text-ink text-xs font-medium border border-hairline hover:bg-surface-soft"
              >
                View All
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <LeaveCard key={app.id} leave={app} onCancelLeave={onCancelLeave} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
