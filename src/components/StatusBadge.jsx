import React from 'react';
import { CheckCircle2, Clock, XCircle, Tag } from 'lucide-react';

export default function StatusBadge({ status, type = 'status', size = 'sm' }) {
  if (type === 'leaveType') {
    const typeConfig = {
      Medical: {
        bg: 'bg-accent-blue/10',
        text: 'text-accent-blue font-medium',
        border: 'border-accent-blue/20',
        dot: 'bg-accent-blue'
      },
      Casual: {
        bg: 'bg-accent-purple/10',
        text: 'text-accent-purple font-medium',
        border: 'border-accent-purple/20',
        dot: 'bg-accent-purple'
      },
      'Academic/Event': {
        bg: 'bg-primary/15',
        text: 'text-brand-green-dark font-medium',
        border: 'border-primary/30',
        dot: 'bg-brand-green-dark'
      },
      Emergency: {
        bg: 'bg-accent-pink/10',
        text: 'text-accent-pink font-medium',
        border: 'border-accent-pink/20',
        dot: 'bg-accent-pink'
      },
      Personal: {
        bg: 'bg-stone/10',
        text: 'text-stone font-medium',
        border: 'border-stone/20',
        dot: 'bg-stone'
      },
      'On-Duty': {
        bg: 'bg-brand-teal/10',
        text: 'text-brand-teal font-medium',
        border: 'border-brand-teal/20',
        dot: 'bg-brand-teal'
      }
    };

    const config = typeConfig[status] || {
      bg: 'bg-surface-soft',
      text: 'text-slate font-medium',
      border: 'border-hairline',
      dot: 'bg-slate'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] border ${config.bg} ${config.text} ${config.border}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status}
      </span>
    );
  }

  // Status Badge (Approved, Pending, Rejected, Draft)
  const statusConfig = {
    Approved: {
      bg: 'bg-brand-green/15',
      text: 'text-brand-green-dark font-semibold',
      border: 'border-brand-green/30',
      icon: CheckCircle2
    },
    Pending: {
      bg: 'bg-accent-orange/10',
      text: 'text-accent-orange font-semibold',
      border: 'border-accent-orange/25',
      icon: Clock
    },
    Rejected: {
      bg: 'bg-slate/10',
      text: 'text-slate font-semibold',
      border: 'border-slate/25',
      icon: XCircle
    },
    Draft: {
      bg: 'bg-surface',
      text: 'text-stone font-medium',
      border: 'border-hairline',
      icon: Tag
    }
  };

  const config = statusConfig[status] || statusConfig.Pending;
  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs gap-1.5'
  };

  return (
    <span className={`inline-flex items-center rounded-lg border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size] || sizeClasses.sm}`}>
      <IconComponent className={size === 'md' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      <span>{status}</span>
    </span>
  );
}
