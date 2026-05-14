// components/PasswordChangeModal.jsx
import React, { useState } from "react";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Send,
  Loader,
} from "lucide-react";
import Button from "./common/Button";
import { useAuth } from "../context/AuthContext";

const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Current Password, 2: Verification Code & New Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { sendPasswordChangeCode, updatePasswordWithVerification } = useAuth();

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const pass = e.target.value;
    setNewPassword(pass);
    setPasswordStrength(calculatePasswordStrength(pass));
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 25) return "bg-rose-500";
    if (strength <= 50) return "bg-amber-400";
    if (strength <= 75) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Enter password";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(newPassword) },
    { text: "One number", met: /[0-9]/.test(newPassword) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const handleSendCode = async () => {
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await sendPasswordChangeCode();
      setStep(2);
      toast.success("Verification code sent to your email");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validate new password
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setError("Password must contain at least one special character");
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await updatePasswordWithVerification({
        currentPassword,
        newPassword,
        verificationCode,
      });
      toast.success("Password updated successfully!");
      onClose();
      // Reset form
      setStep(1);
      setCurrentPassword("");
      setVerificationCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">🔐</div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-primary-100 text-sm mt-1">
            {step === 1
              ? "Enter your current password to continue"
              : "Enter the verification code and your new password"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Current Password
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleSendCode}
                fullWidth
                disabled={isLoading || !currentPassword}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                We'll send a 6-digit verification code to your email address.
                This code expires in 15 minutes.
              </p>
            </div>
          ) : (
            // Step 2: Verification Code & New Password
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className="w-full px-4 py-3 text-center text-2xl tracking-wider font-mono border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Password strength</span>
                    <span
                      className={`font-medium ${
                        passwordStrength === 0
                          ? "text-gray-500"
                          : passwordStrength <= 25
                          ? "text-rose-600"
                          : passwordStrength <= 50
                          ? "text-amber-600"
                          : passwordStrength <= 75
                          ? "text-amber-500"
                          : "text-emerald-600"
                      }`}
                    >
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor(
                        passwordStrength
                      )}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="mt-3 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                          req.met
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span
                        className={
                          req.met ? "text-emerald-700" : "text-gray-500"
                        }
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button
                onClick={handleUpdatePassword}
                fullWidth
                disabled={
                  isLoading ||
                  !verificationCode ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Update Password
                  </>
                )}
              </Button>

              <button
                onClick={() => setStep(1)}
                className="text-sm text-primary-600 hover:text-primary-700 text-center w-full"
              >
                ← Back to enter current password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
