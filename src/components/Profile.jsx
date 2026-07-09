import React from 'react';
import { User, Mail, Phone, MapPin, Award, BookOpen, ShieldCheck, Calendar, Clock, Edit3, CheckCircle2, Heart } from 'lucide-react';

export default function Profile({ student }) {
  const balances = student?.leaveBalances || {
    Casual: { total: 10, used: 0, remaining: 10, color: 'accent-purple' },
    Medical: { total: 12, used: 0, remaining: 12, color: 'accent-blue' },
    Emergency: { total: 5, used: 0, remaining: 5, color: 'accent-pink' }
  };

  const totalUsed = Object.values(balances).reduce((acc, curr) => acc + curr.used, 0);
  const totalQuota = Object.values(balances).reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Hero Profile Header Card */}
      <div className="bg-canvas rounded-2xl p-6 sm:p-8 border border-hairline shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={student?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={student?.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-1 ring-hairline-strong shadow-2xs"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-brand-green border-4 border-canvas shadow-xs" title="Verified Active Student" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded bg-surface-feature text-brand-green-dark font-mono text-xs font-semibold border border-primary/30">
                {student?.rollNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-surface text-stone text-xs font-medium border border-hairline">
                ID: {student?.studentId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-ink mt-2 tracking-tight">
              {student?.name}
            </h1>
            <p className="text-sm font-semibold text-primary-deep mt-0.5">{student?.course}</p>
            <p className="text-xs text-slate mt-1">{student?.department} • {student?.semester}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-hairline text-xs text-stone">
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-4 h-4 text-stone" /> {student?.email}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Phone className="w-4 h-4 text-stone" /> {student?.contactNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quota & Balances Breakdown */}
      <div className="bg-canvas rounded-2xl p-6 sm:p-8 border border-hairline shadow-2xs space-y-6">

        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div>
            <h3 className="text-base font-bold text-ink tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-primary-deep" />
              Semester Leave Quota Breakdown
            </h3>
            <p className="text-xs text-slate mt-0.5">Summary of consumed and available leave days for the current academic session.</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-ink text-canvas font-bold text-xs font-mono">
            {totalQuota - totalUsed} / {totalQuota} Days Left
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(balances).map(([type, data]) => {
            const percentRemaining = Math.round((data.remaining / data.total) * 100);
            return (
              <div key={type} className="p-5 rounded-2xl bg-surface border border-hairline space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-ink">{type} Leave</span>
                  <span className="text-xs font-mono font-bold text-stone">{data.used} Used</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-ink">{data.remaining}</span>
                    <span className="text-xs text-stone ml-1 font-semibold">Remaining</span>
                  </div>
                  <span className="text-xs font-bold text-primary-deep">{percentRemaining}%</span>
                </div>

                <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden border border-hairline/60">
                  <div
                    className="h-full bg-brand-green rounded-full transition-all duration-700"
                    style={{ width: `${percentRemaining}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Advisors & Approving Mentors Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-canvas p-5 rounded-3xl border border-hairline shadow-soft space-y-2">
          <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Class Mentor</p>
          <p className="text-sm font-bold text-ink flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-green-dark" />
            {student?.mentor}
          </p>
          <p className="text-xs text-stone">Primary approval authority for Hackathon/Academic & Casual requests.</p>
        </div>

        <div className="bg-canvas p-5 rounded-3xl border border-hairline shadow-soft space-y-2">
          <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Department HOD</p>
          <p className="text-sm font-bold text-ink flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent-purple" />
            {student?.hod}
          </p>
          <p className="text-xs text-stone">Final authorization authority for Medical (more than 2 days) &amp; Personal leave.</p>
        </div>

        <div className="bg-canvas p-5 rounded-3xl border border-hairline shadow-soft space-y-2">
          <p className="text-[11px] font-bold text-stone uppercase tracking-wider">Hostel Warden</p>
          <p className="text-sm font-bold text-ink flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent-blue" />
            {student?.warden}
          </p>
          <p className="text-xs text-stone">Gate pass & emergency out-pass verification authority.</p>
        </div>
      </div>

      {/* Emergency Contacts & Residential Address */}
      <div className="bg-canvas rounded-3xl p-6 sm:p-8 border border-hairline shadow-soft space-y-4">
        <h3 className="text-base font-bold text-ink tracking-tight flex items-center gap-2 pb-3 border-b border-hairline">
          <Heart className="w-5 h-5 text-accent-pink" />
          Emergency Contacts & Residence Records
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-2xl bg-surface border border-hairline space-y-1">
            <span className="text-[11px] font-bold text-stone uppercase">Registered Contact Phone</span>
            <p className="font-mono font-bold text-sm text-ink">{student?.contactNumber}</p>
            <p className="text-[11px] text-stone">Primary number reached during active campus leave.</p>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-hairline space-y-1">
            <span className="text-[11px] font-bold text-stone uppercase">Parent / Guardian Phone</span>
            <p className="font-mono font-bold text-sm text-ink">{student?.parentContact}</p>
            <p className="text-[11px] text-stone">Verified telephonically for emergency warden gate passes.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-hairline space-y-1">
          <span className="text-[11px] font-bold text-stone uppercase">Current Campus / Hostel Address</span>
          <p className="text-xs sm:text-sm font-medium text-slate flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-primary-deep shrink-0" />
            <span>{student?.address}</span>
          </p>
        </div>
      </div>

    </div>
  );
}
