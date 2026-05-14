// components/EmailVerificationModal.jsx
import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader,
  Send,
} from "lucide-react";
import Button from "./common/Button";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EmailVerificationModal = ({
  isOpen,
  onClose,
  email,
  userId,
  onVerified,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;

      // If we have userId, user is logged in, use protected endpoint
      // Otherwise, user is not logged in (from login page), use public endpoint with email
      if (userId) {
        response = await authAPI.verifyEmailProtected(verificationCode);
      } else {
        response = await authAPI.verifyEmailPublic(email, verificationCode);
      }

      toast.success("Email verified successfully!");

      // If we got a token back (from public verification), auto-login
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // You might want to update auth context here
        onVerified?.();
        onClose();
        navigate("/");
      } else {
        // User was already logged in, just refresh
        onVerified?.();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code");
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    setIsResending(true);
    try {
      if (userId) {
        await authAPI.resendVerificationCode();
      } else {
        await authAPI.resendVerificationCodePublic(email);
      }
      toast.success("New verification code sent to your email");
      setResendCountdown(60);

      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">🧩</div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-primary-100 text-sm mt-1">
            We've sent a verification code to {email}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-gray-600 text-sm">
              Enter the 6-digit verification code sent to your email to verify
              your account.
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                  setError("");
                }}
                placeholder="Enter 6-digit code"
                maxLength="6"
                autoFocus
                className="w-full pl-10 pr-4 py-3 text-center text-2xl tracking-wider font-mono border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            fullWidth
            size="large"
            disabled={isLoading || !verificationCode}
            className="mb-4"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Verify Email
              </>
            )}
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                disabled={isResending || resendCountdown > 0}
                className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <Loader className="w-4 h-4 inline animate-spin mr-1" />
                    Sending...
                  </>
                ) : resendCountdown > 0 ? (
                  `Resend in ${resendCountdown}s`
                ) : (
                  <>
                    <Send className="w-4 h-4 inline mr-1" />
                    Resend Code
                  </>
                )}
              </button>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 text-sm mb-2">
              📧 Having trouble?
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• The code expires in 24 hours</li>
              <li>• Contact support if you still need help</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
