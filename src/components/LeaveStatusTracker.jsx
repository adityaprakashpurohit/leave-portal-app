import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LeaveStatusTracker({ timeline = [], currentStatus = 'Pending' }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 bg-surface-soft rounded-xl text-center text-xs text-stone border border-hairline">
        No tracking timeline data available.
      </div>
    );
  }

  return (
    <div className="py-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone mb-4 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-primary-deep" />
        Approval Stage Timeline
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-hairline-strong">
        {timeline.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isRejected = step.status === 'rejected';

          return (
            <div key={idx} className="relative group">
              {/* Stage Node Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-canvas transition-transform group-hover:scale-110 ${
                  isCompleted
                    ? 'bg-brand-green text-brand-green-dark'
                    : isRejected
                    ? 'bg-slate text-canvas'
                    : isCurrent
                    ? 'bg-accent-orange text-canvas animate-pulse'
                    : 'bg-surface-soft border-2 border-hairline-strong text-stone'
                }`}
              >
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                {isRejected && <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />}
                {isCurrent && <Clock className="w-3.5 h-3.5 stroke-[2.5]" />}
                {!isCompleted && !isRejected && !isCurrent && <span className="w-2 h-2 rounded-full bg-hairline-strong" />}
              </div>

              {/* Stage Content Card */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-surface-feature/50 border-primary/40 shadow-2xs'
                    : isRejected
                    ? 'bg-slate/10 border-slate/30'
                    : 'bg-surface border-hairline hover:border-hairline-strong'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">{step.stage}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-accent-orange/15 text-accent-orange text-[10px] font-bold">
                        In Progress
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2 py-0.5 rounded-full bg-slate text-canvas text-[10px] font-bold">
                        Stopped / Rejected
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-stone">{step.timestamp}</span>
                </div>

                <p className="text-xs font-medium text-slate mt-1">{step.title}</p>
                {step.note && (
                  <div className="mt-2 pt-2 border-t border-hairline/60 text-xs text-stone italic flex items-start gap-1.5 bg-canvas/60 p-2 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 text-stone shrink-0 mt-0.5" />
                    <span>{step.note}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
