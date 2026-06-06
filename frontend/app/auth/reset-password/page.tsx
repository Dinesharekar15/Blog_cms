"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import PageLayout from "../../components/ui/PageLayout";
import FormCard from "../../components/ui/FormCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60;

export default function ResetPasswordPage() {
  const router = useRouter();
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [showPassword, setShowPassword] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Read resetEmail from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("resetEmail");
    if (!stored) {
      router.replace("/auth/forgot-password");
      return;
    }
    setEmail(stored);
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${backend_url}/auth/reset-password`, {
        email,
        otp: otpString,
        newPassword,
      });

      setSuccess("Password reset! Redirecting to sign in… 🎉");
      sessionStorage.removeItem("resetEmail");
      setTimeout(() => router.push("/auth/signin"), 1200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Something went wrong. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const maskedEmail = email
    ? email.replace(/(.{1})(.*)(@.*)/, (_, a, _b, c) => `${a}${"*".repeat(5)}${c}`)
    : "your email";

  return (
    <PageLayout
      title="Reset your password"
      subtitle={`Enter the code sent to ${maskedEmail}`}
    >
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              <span>✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Key icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">
              🗝️
            </div>
          </div>

          {/* OTP Boxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Reset code
            </label>
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-otp-input-${index}`}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`
                    w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none
                    transition-all duration-200 bg-white
                    ${digit ? "border-indigo-400 text-gray-900 shadow-sm" : "border-gray-200 text-gray-400"}
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
                    hover:border-indigo-300
                  `}
                  autoFocus={index === 0}
                  disabled={loading || !!success}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mt-3">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-500">
                  Code expires in{" "}
                  <span className={`font-semibold ${timeLeft < 60 ? "text-red-500" : "text-indigo-500"}`}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-500 font-medium">
                  Code expired.{" "}
                  <Link href="/auth/forgot-password" className="underline">
                    Request a new one
                  </Link>
                </p>
              )}
            </div>
          </div>

          {/* New Password */}
          <div>
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={newPassword}
              onChange={(e) => { setError(""); setNewPassword(e.target.value); }}
              placeholder="Create a new password (min 6 chars)"
              showPasswordToggle
              required
            />
            {newPassword && newPassword.length < 6 && (
              <p className="ml-2 text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Input
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => { setError(""); setConfirmPassword(e.target.value); }}
              placeholder="Re-enter your new password"
              required
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="ml-2 text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !!success || otp.join("").length < OTP_LENGTH}
          >
            {loading ? "Resetting password…" : "Reset Password"}
          </Button>
        </form>
      </FormCard>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Remember your password?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
