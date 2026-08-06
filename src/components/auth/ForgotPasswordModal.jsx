"use client";

import { useState } from "react";
import { X, Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { forgotPasswordAPI, resetPasswordAPI } from "../../api/auth.api";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ isOpen, onClose, onResetSuccess }) => {
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP & New Password, Step 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordAPI({ email: email.trim() });
      toast.success(res.data.message || "OTP code sent to your email!");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await forgotPasswordAPI({ email: email.trim() });
      toast.success(res.data.message || "New OTP code sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordAPI({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      toast.success(res.data.message || "Password reset successfully!");
      setStep(3);
      if (onResetSuccess) {
        onResetSuccess(email);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 transition-all">
        
        {/* MODAL HEADER */}
        <div className="relative bg-gradient-to-r from-teal-600 to-[var(--primary)] text-white p-6 text-center">
          <button
            onClick={handleClose}
            type="button"
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-full transition"
          >
            <X size={20} />
          </button>

          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
            {step === 1 && <Mail size={28} className="text-white" />}
            {step === 2 && <KeyRound size={28} className="text-white" />}
            {step === 3 && <CheckCircle2 size={32} className="text-white" />}
          </div>

          <h3 className="text-xl font-extrabold tracking-tight">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter Verification Code"}
            {step === 3 && "Password Reset Complete!"}
          </h3>

          <p className="text-xs text-teal-50 mt-1 font-medium px-4">
            {step === 1 && "Enter your registered email to receive a 6-digit reset code."}
            {step === 2 && `We've sent a 6-digit OTP code to ${email}`}
            {step === 3 && "Your password has been successfully updated. You can now log in."}
          </p>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-5">
          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 text-left">
                  Registered Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-3 rounded-lg text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Sending OTP Code...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          )}

          {/* STEP 2: VERIFY OTP & RESET PASSWORD */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex items-center justify-between bg-teal-50 border border-teal-100 rounded-lg p-3 text-xs text-teal-800">
                <span className="truncate font-medium">Email: <strong>{email}</strong></span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[var(--primary)] hover:underline font-bold flex items-center gap-1 ml-2 shrink-0"
                >
                  <ArrowLeft size={12} /> Change
                </button>
              </div>

              {/* OTP CODE */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 text-left">
                  6-Digit OTP Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-sm tracking-widest font-bold transition"
                  />
                </div>
              </div>

              {/* NEW PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 text-left">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 text-left">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-3 rounded-lg text-sm transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-xs text-[var(--primary)] hover:underline font-semibold transition"
                >
                  {resendLoading ? "Resending..." : "Didn't get the code? Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <p className="text-sm text-slate-600">
                Your password has been changed successfully. You can now use your new password to sign into Chhapi.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-3 rounded-lg text-sm transition shadow-md"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
