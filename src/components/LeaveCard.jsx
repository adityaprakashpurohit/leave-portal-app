import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import LeaveStatusTracker from './LeaveStatusTracker';
import { Calendar, Clock, FileText, UserCheck, ChevronRight, X, BookOpen, Download } from 'lucide-react';

export default function LeaveCard({ leave, onCancelLeave, isFacultyView = false, onApprove, onReject, compactButton = false }) {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const handleApprove = () => {
    if (onApprove) onApprove(leave.id);
    setShowModal(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a brief remark or reason for rejection.");
      return;
    }
    if (onReject) onReject(leave.id, rejectReason);
    setShowModal(false);
  };

  return (
    <>
      {/* If compactButton is true, only render the trigger button for Table View */}
      {compactButton ? (
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface hover:bg-ink hover:text-canvas text-ink border border-hairline transition-colors"
        >
          View Details
        </button>
      ) : (
        /* Card View UI */
        <div className="bg-canvas rounded-2xl border border-hairline hover:border-hairline-strong shadow-2xs transition-all p-5 flex flex-col justify-between">
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-hairline mb-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={leave.leaveType} type="leaveType" />
                <span className="text-xs font-mono text-stone font-medium">{leave.id}</span>
              </div>
              <StatusBadge status={leave.status} />
            </div>

            {/* Student Info (if faculty view) */}
            {isFacultyView && (
              <div className="mb-3 p-3 rounded-xl bg-surface sm:flex sm:items-center justify-between border border-hairline">
                <div>
                  <p className="text-xs font-semibold text-ink">{leave.studentName} <span className="text-stone font-normal">({leave.rollNumber})</span></p>
                  <p className="text-[11px] text-stone mt-0.5">{leave.department} • {leave.semester}</p>
                </div>
                <span className="inline-block mt-1 sm:mt-0 text-[11px] font-medium text-stone bg-canvas px-2 py-1 rounded-lg border border-hairline">
                  To: {leave.authority}
                </span>
              </div>
            )}

            {/* Date range & Days */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-ink font-medium text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-stone" />
                <span>{leave.fromDate}</span>
                {leave.fromDate !== leave.toDate && (
                  <>
                    <span className="text-stone">→</span>
                    <span>{leave.toDate}</span>
                  </>
                )}
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface font-mono text-xs font-semibold text-ink border border-hairline">
                {leave.days} {leave.days === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            {/* Reason Snippet */}
            <p className="text-xs text-slate line-clamp-2 leading-relaxed bg-surface/50 p-3 rounded-xl border border-hairline mb-3">
              "{leave.reason}"
            </p>

            {/* Missed classes tags */}
            {leave.missedClasses && leave.missedClasses.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                <span className="text-[11px] text-stone font-medium">Missed:</span>
                {leave.missedClasses.map((cls, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-lg bg-surface text-[11px] font-medium text-slate border border-hairline truncate max-w-[150px]">
                    {cls.split(':')[0]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="pt-3 border-t border-hairline flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 text-[11px] text-stone">
              <Clock className="w-3.5 h-3.5 text-stone" />
              <span>Applied: {leave.appliedOn?.split(' ')[0]}</span>
            </div>

            <div className="flex items-center gap-2">
              {leave.status === 'Pending' && !isFacultyView && onCancelLeave && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to cancel application ${leave.id}?`)) {
                      onCancelLeave(leave.id);
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate hover:text-canvas hover:bg-slate border border-hairline transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface hover:bg-ink hover:text-canvas text-ink border border-hairline transition-colors flex items-center gap-1"
              >
                <span>Details & Track</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail & Status Tracker Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/50 backdrop-blur-2xs">
          <div className="bg-canvas rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col border border-hairline overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-ink text-canvas flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-primary px-2 py-0.5 rounded bg-white/10">
                    {leave.id}
                  </span>
                  <StatusBadge status={leave.status} size="sm" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-canvas mt-1">
                  {leave.leaveType} Leave Application
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowRejectInput(false);
                }}
                className="p-1.5 rounded-lg text-stone hover:text-canvas hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              
              {/* Student Metadata Box */}
              <div className="p-4 rounded-xl bg-surface border border-hairline flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-stone uppercase">Student Applicant</p>
                  <p className="font-semibold text-sm text-ink mt-0.5">{leave.studentName} <span className="text-stone font-normal">({leave.rollNumber})</span></p>
                  <p className="text-xs text-slate mt-0.5">{leave.department} • {leave.semester}</p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-hairline">
                  <p className="text-[11px] font-semibold text-stone uppercase">Approving Authority</p>
                  <p className="font-semibold text-xs text-ink mt-0.5">{leave.authority}</p>
                  <p className="text-xs text-stone mt-0.5 font-mono">Applied: {leave.appliedOn}</p>
                </div>
              </div>

              {/* Leave Dates & Duration Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <div className="p-3 rounded-xl bg-surface border border-hairline text-center">
                  <p className="text-[11px] font-semibold text-stone uppercase">From Date</p>
                  <p className="text-xs sm:text-sm font-semibold text-ink mt-1">{leave.fromDate}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-hairline text-center">
                  <p className="text-[11px] font-semibold text-stone uppercase">To Date</p>
                  <p className="text-xs sm:text-sm font-semibold text-ink mt-1">{leave.toDate}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-feature border border-primary/30 text-center">
                  <p className="text-[11px] font-semibold text-brand-green-dark uppercase">Duration</p>
                  <p className="text-xs sm:text-sm font-bold text-primary-deep mt-1">{leave.days} {leave.days === 1 ? 'Day' : 'Days'}</p>
                </div>
              </div>

              {/* Full Reason */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone" /> Reason for Leave
                </h4>
                <div className="p-4 rounded-xl bg-surface text-xs text-ink leading-relaxed border border-hairline">
                  "{leave.reason}"
                </div>
              </div>

              {/* Contact Info during Leave */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-surface border border-hairline text-xs">
                  <span className="text-stone font-medium block text-[11px]">Student Contact During Leave:</span>
                  <span className="font-mono text-ink font-semibold mt-0.5 block">{leave.contactNumber || "N/A"}</span>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-hairline text-xs">
                  <span className="text-stone font-medium block text-[11px]">Parent/Guardian Contact:</span>
                  <span className="font-mono text-ink font-semibold mt-0.5 block">{leave.parentContact || "N/A"}</span>
                </div>
              </div>

              {/* Address during leave if provided */}
              {leave.address && (
                <div className="p-3 rounded-xl bg-surface border border-hairline text-xs">
                  <span className="text-stone font-medium block text-[11px]">Address During Leave:</span>
                  <span className="text-ink mt-0.5 block">{leave.address}</span>
                </div>
              )}

              {/* Supporting Document Proof */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">Supporting Attachment</h4>
                {leave.documentName ? (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-hairline">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-stone font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink">{leave.documentName}</p>
                        <p className="text-[11px] text-stone">{leave.documentSize || '1.2 MB'} • Medical/Event Attachment</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading attachment: ${leave.documentName}`)}
                      className="px-3 py-1.5 rounded-lg bg-ink text-canvas text-xs font-medium hover:bg-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> View
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-surface border border-hairline text-xs text-stone">
                    No attachment provided for this request.
                  </div>
                )}
              </div>

              {/* Missed Classes / Subjects */}
              {leave.missedClasses && leave.missedClasses.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone mb-1.5">Classes & Subjects to be Missed</h4>
                  <div className="flex flex-wrap gap-2">
                    {leave.missedClasses.map((sub, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-surface text-xs font-medium text-slate border border-hairline flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-stone" />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Timeline Stepper Component */}
              <div className="pt-3 border-t border-hairline">
                <LeaveStatusTracker timeline={leave.timeline} currentStatus={leave.status} />
              </div>

              {/* Faculty Action Area inside Modal */}
              {isFacultyView && leave.status === 'Pending' && (
                <div className="p-4 rounded-xl bg-surface border border-hairline space-y-3">
                  <h4 className="text-xs font-semibold uppercase text-ink flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-stone" /> Faculty Authority Review
                  </h4>
                  <p className="text-xs text-slate">
                    Review attendance record and attached proof before granting or rejecting leave.
                  </p>

                  {showRejectInput && (
                    <div className="space-y-2">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        className="w-full p-3 rounded-xl border border-hairline bg-canvas text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={2}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {!showRejectInput ? (
                      <button
                        onClick={() => setShowRejectInput(true)}
                        className="px-4 py-2 rounded-xl bg-surface text-ink border border-hairline font-medium text-xs hover:bg-slate hover:text-canvas transition-colors"
                      >
                        Reject...
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowRejectInput(false)}
                          className="px-3 py-2 rounded-xl bg-surface text-stone text-xs font-medium hover:bg-canvas border border-hairline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReject}
                          className="px-4 py-2 rounded-xl bg-accent-orange text-canvas font-medium text-xs hover:opacity-90 transition-opacity"
                        >
                          Confirm Rejection
                        </button>
                      </>
                    )}

                    <button
                      onClick={handleApprove}
                      className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-deep text-on-primary font-semibold text-xs transition-colors"
                    >
                      Approve Leave
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-surface border-t border-hairline flex items-center justify-between">
              <span className="text-xs text-stone">
                Ref ID: <strong className="font-mono text-ink">{leave.id}</strong>
              </span>
              <button
                onClick={() => {
                  setShowModal(false);
                  setShowRejectInput(false);
                }}
                className="px-4 py-2 rounded-xl bg-ink text-canvas font-medium text-xs hover:bg-charcoal transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
