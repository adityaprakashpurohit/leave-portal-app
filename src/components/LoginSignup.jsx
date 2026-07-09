import React, { useState, useEffect } from "react";
import {
  Award,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Helper function to determine role strictly based on credentials
// Helper function to determine role strictly based on credentials
const detectRoleFromCredentials = (id = "", email = "", name = "") => {
  const idStr = id.toLowerCase().trim();
  const emailStr = email.toLowerCase().trim();
  const nameStr = name.toLowerCase().trim();

  // Mentor indicators
  if (
    idStr.includes("mentor") ||
    idStr.includes("204") ||
    emailStr.includes("ananya") ||
    nameStr.includes("mentor") ||
    nameStr.includes("ananya")
  ) {
    return "mentor";
  }

  // Faculty / HOD indicators
  if (
    emailStr.includes("faculty") ||
    emailStr.includes("staff") ||
    emailStr.includes("vikram") ||
    emailStr.includes("suresh") ||
    emailStr.startsWith("prof") ||
    emailStr.startsWith("dr") ||
    idStr.startsWith("fac") ||
    idStr.startsWith("stf") ||
    idStr.includes("hod") ||
    idStr.includes("warden") ||
    nameStr.includes("dr.") ||
    nameStr.includes("prof.") ||
    nameStr.includes("warden") ||
    nameStr.includes("hod")
  ) {
    return "hod";
  }

  return "student";
};

export default function LoginSignup({ onLogin }) {
  const [formData, setFormData] = useState({
    studentId: "2024CS1089",
    email: "aarav.sharma@college.edu",
    password: "password123",
    fullName: "Aarav Sharma",
  });

  const [detectedRole, setDetectedRole] = useState("student");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Automatically detect role whenever ID, email, or name changes
  useEffect(() => {
    const role = detectRoleFromCredentials(
      formData.studentId,
      formData.email,
      formData.fullName,
    );
    setDetectedRole(role);
  }, [formData.studentId, formData.email, formData.fullName]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Quick select credentials helper for testing
  const selectQuickCredentials = (profileType) => {
    if (profileType === "student") {
      setFormData({
        studentId: "2024CS1089",
        email: "aarav.sharma@college.edu",
        password: "password123",
        fullName: "Aarav Sharma",
      });
    } else if (profileType === "hod") {
      setFormData({
        studentId: "FAC-HOD-CSE",
        email: "vikram.mehta@faculty.college.edu",
        password: "password123",
        fullName: "Dr. Vikram Mehta (HOD)",
      });
    } else if (profileType === "mentor") {
      setFormData({
        studentId: "FAC-CSE-204",
        email: "ananya.desai@faculty.college.edu",
        password: "password123",
        fullName: "Prof. Ananya Desai (Mentor)",
      });
    }
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId || formData.studentId.trim().length < 4) {
      newErrors.studentId = "Valid Institutional ID / Roll Number is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email =
        "Please enter a valid institutional / college email address.";
    } else if (
      !formData.email.toLowerCase().includes(".edu") &&
      !formData.email.toLowerCase().includes("college")
    ) {
      newErrors.email =
        "Please use your official institutional email (ending with .edu or @college.edu).";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const finalRole = detectRoleFromCredentials(
      formData.studentId,
      formData.email,
      formData.fullName,
    );

    const roleName = finalRole === "hod" 
      ? "HOD Approving Authority" 
      : finalRole === "mentor" 
      ? "Class Mentor Desk" 
      : "Student Portal User";

    const defaultName = finalRole === "hod"
      ? "Dr. Vikram Mehta (HOD)"
      : finalRole === "mentor"
      ? "Prof. Ananya Desai (Mentor)"
      : "Aarav Sharma";

    setSuccessMsg(
      `Credentials verified! Access granted as ${roleName}. Launching portal...`,
    );
    setTimeout(() => {
      onLogin({
        role: finalRole,
        studentId: formData.studentId,
        name: formData.fullName || defaultName,
        email: formData.email,
      });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            ApexLeave
          </h1>
        </div>

        {/* Form Box with 3-color accent bar */}
        <div className="bg-canvas rounded-2xl border border-hairline shadow-2xs overflow-hidden">
          {/* Bespoke Human-Designed Color Accent Strip (#f3727f, #ffa42b, #539df5) */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#f3727f] via-[#ffa42b] to-[#539df5]" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Institutional Login Header */}
            <div className="pb-3 border-b border-hairline flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-ink tracking-tight">
                  Institutional Portal Login
                </h2>
                <p className="text-[11px] text-stone mt-0.5">
                  Use your university assigned credentials to access your portal
                </p>
              </div>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-[#539df5]/10 border border-[#539df5]/30 text-[#1f66be] text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#539df5] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Quick Select Credentials Row with User's 3 Color Codes */}
            <div className="p-3.5 rounded-xl bg-surface border border-hairline space-y-2.5">
              <span className="block text-[11px] font-semibold text-stone uppercase tracking-wider">
                Quick Fill Test Credentials (Auto-Role Detection)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => selectQuickCredentials("student")}
                  className={`py-2.5 px-3 min-h-[42px] rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center ${
                    formData.studentId === "2024CS1089" &&
                    formData.email.includes("aarav")
                      ? "bg-[#539df5] text-white border-[#539df5] font-semibold shadow-2xs"
                      : "bg-canvas border-hairline text-slate hover:border-[#539df5]/60 hover:text-[#539df5]"
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickCredentials("hod")}
                  className={`py-2.5 px-3 min-h-[42px] rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center ${
                    formData.studentId.includes("HOD")
                      ? "bg-[#ffa42b] text-white border-[#ffa42b] font-semibold shadow-2xs"
                      : "bg-canvas border-hairline text-slate hover:border-[#ffa42b]/60 hover:text-[#ffa42b]"
                  }`}
                >
                  Faculty (HOD)
                </button>
                <button
                  type="button"
                  onClick={() => selectQuickCredentials("mentor")}
                  className={`py-2.5 px-3 min-h-[42px] rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center ${
                    formData.studentId.includes("204") &&
                    formData.email.includes("ananya")
                      ? "bg-[#f3727f] text-white border-[#f3727f] font-semibold shadow-2xs"
                      : "bg-canvas border-hairline text-slate hover:border-[#f3727f]/60 hover:text-[#f3727f]"
                  }`}
                >
                  Class Mentor
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institutional ID */}
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Institutional ID / Roll Number
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-stone absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => handleChange("studentId", e.target.value)}
                    placeholder="e.g. 2024CS1089 or FAC-HOD-CSE"
                    className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-surface border border-hairline text-xs sm:text-sm font-mono font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-[#539df5]/50 focus:border-[#539df5] transition-all"
                  />
                </div>
                {errors.studentId && (
                  <p className="text-[11px] text-[#f3727f] font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                    {errors.studentId}
                  </p>
                )}
              </div>
              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      alert("Demo: Use any password (e.g., password123)")
                    }
                    className="text-xs sm:text-[11px] text-[#539df5] font-semibold hover:underline min-h-[28px] flex items-center"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-surface border border-hairline text-xs sm:text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-[#539df5]/50 focus:border-[#539df5] transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="text-[11px] text-[#f3727f] font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />{" "}
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3.5 px-6 rounded-xl text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${
                    detectedRole === "hod" || detectedRole === "faculty"
                      ? "bg-[#ffa42b] hover:bg-[#e8921a]"
                      : detectedRole === "mentor"
                      ? "bg-[#f3727f] hover:bg-[#e05e6b]"
                      : "bg-[#539df5] hover:bg-[#3d89e2]"
                  }`}
                >
                  <span>{`Sign In as ${
                    detectedRole === "hod" || detectedRole === "faculty"
                      ? "Faculty (HOD)"
                      : detectedRole === "mentor"
                      ? "Class Mentor"
                      : "Student"
                  }`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-stone">
          Protected by ApexLeave Campus SSO & Academic Integrity System • 2026
        </p>
      </div>
    </div>
  );
}
