import React, { useState, useEffect } from 'react';
import { MOCK_SUBJECTS, MOCK_AUTHORITIES } from '../data/mockData';
import { Upload, FileText, CheckCircle2, AlertCircle, Calendar, Phone, MapPin, ShieldCheck, Trash2, Check, ArrowRight } from 'lucide-react';

export default function LeaveForm({ student, onSubmitLeave, onSaveDraft }) {
  // Form State
  const [formData, setFormData] = useState({
    leaveType: 'Medical',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    days: 3,
    reason: '',
    missedClasses: [],
    contactNumber: student?.contactNumber || '+91 98765 43210',
    parentContact: student?.parentContact || '+91 98111 22233',
    address: student?.address || '',
    authority: MOCK_AUTHORITIES[1]?.name || 'HOD CSE (Dr. Vikram Mehta)',
    declaration: false,
    documentFile: null,
    documentName: null,
    documentSize: null
  });

  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);

  // Auto-calculate Number of Days when dates change
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > 0) {
        setFormData(prev => ({ ...prev, days: diffDays }));
        if (errors.dateRange) {
          setErrors(prev => ({ ...prev, dateRange: null }));
        }
      } else {
        setFormData(prev => ({ ...prev, days: 0 }));
        setErrors(prev => ({ ...prev, dateRange: 'To Date cannot be earlier than From Date.' }));
      }
    }
  }, [formData.fromDate, formData.toDate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubjectToggle = (subjectName) => {
    setFormData(prev => {
      const current = prev.missedClasses;
      const updated = current.includes(subjectName)
        ? current.filter(s => s !== subjectName)
        : [...current, subjectName];
      return { ...prev, missedClasses: updated };
    });
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    // Validate File Type (PDF, JPG, PNG)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.jpg') && !file.name.endsWith('.png')) {
      setErrors(prev => ({ ...prev, document: 'Invalid file format. Please upload PDF, JPG, or PNG files only.' }));
      return;
    }

    // Validate File Size (Max 5 MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrors(prev => ({ ...prev, document: `File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).` }));
      return;
    }

    setErrors(prev => ({ ...prev, document: null }));
    setFormData(prev => ({
      ...prev,
      documentFile: file,
      documentName: file.name,
      documentSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.days <= 0) {
      newErrors.dateRange = 'Invalid date range selected. To Date must be on or after From Date.';
    }

    if (!formData.reason || formData.reason.trim().length < 15) {
      newErrors.reason = 'Please provide a detailed reason (at least 15 characters required).';
    }

    if (!formData.contactNumber || formData.contactNumber.trim().length < 8) {
      newErrors.contactNumber = 'Valid contact number is required.';
    }

    if (!formData.parentContact || formData.parentContact.trim().length < 8) {
      newErrors.parentContact = 'Parent/Guardian contact number is required.';
    }

    if (formData.leaveType === 'Medical' && formData.days >= 3 && !formData.documentName) {
      newErrors.document = 'Medical certificate is required for medical leave exceeding 2 days.';
    }

    if (!formData.declaration) {
      newErrors.declaration = 'You must confirm the accuracy of this application before submitting.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newApplication = {
      id: `LV-2026-0${Math.floor(4000 + Math.random() * 900)}`,
      studentId: student.studentId,
      studentName: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      semester: student.semester.split(' ')[0] + ' ' + student.semester.split(' ')[1],
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      days: formData.days,
      reason: formData.reason,
      contactNumber: formData.contactNumber,
      parentContact: formData.parentContact,
      address: formData.address,
      missedClasses: formData.missedClasses,
      documentName: formData.documentName,
      documentSize: formData.documentSize,
      authority: formData.authority,
      status: 'Pending',
      appliedOn: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timeline: [
        {
          stage: 'Applied',
          title: 'Application Submitted Online',
          timestamp: 'Just now',
          status: 'completed',
          note: formData.documentName ? `Attachment uploaded: ${formData.documentName}` : 'No supporting document attached.'
        },
        {
          stage: 'Mentor Approved',
          title: 'Class Mentor Review',
          timestamp: 'In Progress',
          status: 'current',
          note: `Assigned to ${formData.authority} for clearance.`
        },
        {
          stage: 'HOD Approved',
          title: 'Final HOD Authorization',
          timestamp: 'Awaiting',
          status: 'pending',
          note: 'Requires initial verification step.'
        }
      ]
    };

    if (onSubmitLeave) {
      onSubmitLeave(newApplication);
    }

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  const handleDraft = () => {
    if (!formData.reason.trim()) {
      alert("Please enter at least a brief reason to save as draft.");
      return;
    }

    const draftApplication = {
      ...formData,
      id: `DRAFT-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.studentId,
      studentName: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      semester: student.semester,
      status: 'Draft',
      appliedOn: 'Saved as Draft today'
    };

    if (onSaveDraft) {
      onSaveDraft(draftApplication);
    }

    setDraftSuccess(true);
    setTimeout(() => setDraftSuccess(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Page Title */}
      <div className="bg-canvas rounded-2xl p-6 sm:p-7 border border-hairline shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
          New Leave Application
        </h1>
        <p className="text-xs sm:text-sm text-slate mt-1">
          Complete and submit your formal leave request. Please attach relevant medical or academic proofs for verification.
        </p>

        {/* Success Alert Banner */}
        {submitSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-surface-feature border border-primary text-brand-green-dark flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary-deep shrink-0" />
            <div>
              <p className="font-semibold text-sm">Application submitted successfully</p>
              <p className="text-xs mt-0.5">Your request has been routed to {formData.authority} for review.</p>
            </div>
          </div>
        )}

        {draftSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-surface border border-hairline text-ink flex items-center gap-3">
            <FileText className="w-4 h-4 text-stone shrink-0" />
            <p className="text-xs font-medium">Saved as draft. You can continue and submit it later.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Applicant Information */}
        <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
              Applicant Information
            </h2>
            <span className="text-xs text-stone">Auto-filled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-surface border border-hairline">
              <label className="text-[11px] font-semibold text-stone uppercase">Student Name</label>
              <p className="font-semibold text-sm text-ink mt-0.5 truncate">{student?.name}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-hairline">
              <label className="text-[11px] font-semibold text-stone uppercase">Roll Number</label>
              <p className="font-mono font-semibold text-sm text-ink mt-0.5 truncate">{student?.rollNumber}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-hairline">
              <label className="text-[11px] font-semibold text-stone uppercase">Course / Branch</label>
              <p className="font-medium text-xs text-ink mt-0.5 truncate">{student?.course}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-hairline">
              <label className="text-[11px] font-semibold text-stone uppercase">Semester</label>
              <p className="font-medium text-xs text-ink mt-0.5 truncate">{student?.semester}</p>
            </div>
          </div>
        </div>

        {/* Leave Schedule & Type */}
        <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-5">
          <div className="pb-3 border-b border-hairline">
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
              Leave Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Leave Type <span className="text-accent-orange">*</span>
              </label>
              <select
                value={formData.leaveType}
                onChange={(e) => handleChange('leaveType', e.target.value)}
                className="w-full p-3 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Medical">Medical Leave</option>
                <option value="Casual">Casual Leave</option>
                <option value="Personal">Personal / Family Leave</option>
                <option value="Emergency">Emergency Leave</option>
                <option value="Academic/Event">Academic / Event</option>
                <option value="On-Duty">On-Duty / Sports</option>
              </select>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  From Date <span className="text-accent-orange">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => handleChange('fromDate', e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  To Date <span className="text-accent-orange">*</span>
                </label>
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => handleChange('toDate', e.target.value)}
                  className="w-full p-3 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Duration Summary Bar */}
          <div className="p-3.5 rounded-xl bg-surface border border-hairline flex items-center justify-between">
            <span className="text-xs font-medium text-stone">Calculated Duration</span>
            <span className="text-xs font-bold text-ink">
              {formData.days > 0 ? `${formData.days} calendar ${formData.days === 1 ? 'day' : 'days'}` : 'Invalid date range'}
            </span>
          </div>

          {errors.dateRange && (
            <div className="p-3 rounded-xl bg-semantic-warning-bg border border-semantic-warning-text/30 text-semantic-warning-text text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.dateRange}</span>
            </div>
          )}

          {/* Medical Certificate Notice */}
          {formData.leaveType === 'Medical' && formData.days >= 3 && !formData.documentName && (
            <div className="p-3.5 rounded-xl bg-semantic-warning-bg border border-semantic-warning-text/30 text-semantic-warning-text text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Medical Certificate Required: </span>
                <span>For medical absences exceeding 2 consecutive days, a doctor's certificate must be attached.</span>
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Reason for Leave <span className="text-accent-orange">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Provide specific details of your absence..."
              rows={4}
              className={`w-full p-3.5 rounded-xl bg-surface border text-xs text-ink focus:outline-none focus:ring-2 transition-all leading-relaxed ${
                errors.reason ? 'border-accent-orange focus:ring-accent-orange/30' : 'border-hairline focus:ring-primary/50'
              }`}
            />
            {errors.reason && (
              <p className="text-xs text-accent-orange font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.reason}
              </p>
            )}
          </div>
        </div>

        {/* Classes to be Missed */}
        <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div>
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
                Classes & Subjects to be Missed
              </h2>
              <p className="text-xs text-slate mt-0.5">Select scheduled classes during this period (optional)</p>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-surface border border-hairline text-stone">
              {formData.missedClasses.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {MOCK_SUBJECTS.map(subject => {
              const isSelected = formData.missedClasses.includes(subject.name);
              return (
                <div
                  key={subject.id}
                  onClick={() => handleSubjectToggle(subject.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-surface border-ink text-ink'
                      : 'bg-canvas border-hairline hover:border-hairline-strong text-slate'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-hairline text-primary focus:ring-0"
                    />
                    <div>
                      <p className="text-xs font-medium leading-snug text-ink">{subject.name}</p>
                      <p className="text-[11px] text-stone mt-0.5">{subject.faculty}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information During Leave */}
        <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-5">
          <div className="pb-3 border-b border-hairline">
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
              Emergency & Contact Coordinates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Student Contact Number <span className="text-accent-orange">*</span>
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full p-3 rounded-xl bg-surface border text-xs font-mono text-ink focus:outline-none focus:ring-2 ${
                  errors.contactNumber ? 'border-accent-orange focus:ring-accent-orange/30' : 'border-hairline focus:ring-primary/50'
                }`}
              />
              {errors.contactNumber && (
                <p className="text-xs text-accent-orange font-medium mt-1">{errors.contactNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Parent / Guardian Number <span className="text-accent-orange">*</span>
              </label>
              <input
                type="text"
                value={formData.parentContact}
                onChange={(e) => handleChange('parentContact', e.target.value)}
                placeholder="+91 98111 22233"
                className={`w-full p-3 rounded-xl bg-surface border text-xs font-mono text-ink focus:outline-none focus:ring-2 ${
                  errors.parentContact ? 'border-accent-orange focus:ring-accent-orange/30' : 'border-hairline focus:ring-primary/50'
                }`}
              />
              {errors.parentContact && (
                <p className="text-xs text-accent-orange font-medium mt-1">{errors.parentContact}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Address During Leave <span className="text-stone font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Sector 15 Chandigarh Residence or City Hospital Ward 3..."
              className="w-full p-3 rounded-xl bg-surface border border-hairline text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Documents & Authority Routing */}
        <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-5">
          <div className="pb-3 border-b border-hairline">
            <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
              Supporting Document & Approving Authority
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Supporting Attachment <span className="text-stone font-normal">(Medical certificate or invitation letter — Max 5 MB)</span>
            </label>

            {!formData.documentName ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? 'border-primary bg-surface-feature/40'
                    : errors.document
                    ? 'border-accent-orange bg-semantic-warning-bg/40'
                    : 'border-hairline hover:border-hairline-strong bg-surface'
                }`}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <Upload className="w-6 h-6 text-stone mx-auto mb-2" />
                <p className="text-xs font-medium text-ink">Click to upload or drag & drop</p>
                <p className="text-[11px] text-stone mt-0.5">PDF, JPG or PNG up to 5MB</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-surface border border-hairline flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-canvas border border-hairline flex items-center justify-center text-xs font-bold text-stone">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink">{formData.documentName}</p>
                    <p className="text-[11px] text-stone mt-0.5">{formData.documentSize || '1.2 MB'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, documentFile: null, documentName: null, documentSize: null }))}
                  className="p-1.5 rounded-lg text-slate hover:text-accent-orange transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.document && (
              <p className="text-xs text-accent-orange font-medium mt-1.5">{errors.document}</p>
            )}
          </div>

          <div className="pt-1">
            <label className="block text-xs font-semibold text-ink mb-1.5">
              Approving Authority <span className="text-accent-orange">*</span>
            </label>
            <select
              value={formData.authority}
              onChange={(e) => handleChange('authority', e.target.value)}
              className="w-full p-3 rounded-xl bg-surface border border-hairline text-xs font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {MOCK_AUTHORITIES.map(auth => (
                <option key={auth.id} value={auth.name}>
                  {auth.name} ({auth.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Declaration & Submission Actions */}
        <div className="bg-canvas rounded-2xl p-6 border border-hairline shadow-2xs space-y-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.declaration}
              onChange={() => handleChange('declaration', !formData.declaration)}
              className="mt-0.5 w-4 h-4 rounded border-hairline text-primary focus:ring-0"
            />
            <div>
              <p className="text-xs font-medium text-ink">
                I declare that the statements made in this leave application are true and accurate.
              </p>
              {errors.declaration && (
                <p className="text-xs text-accent-orange font-medium mt-1">{errors.declaration}</p>
              )}
            </div>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-hairline">
            <button
              type="button"
              onClick={handleDraft}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-soft text-ink font-medium text-xs border border-hairline transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-deep text-on-primary font-semibold text-xs shadow-2xs transition-colors"
            >
              Submit Application
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
