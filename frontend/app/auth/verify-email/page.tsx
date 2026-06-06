"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PageLayout from "../../components/ui/PageLayout";
import FormCard from "../../components/ui/FormCard";
import Button from "../../components/ui/Button";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const OTP_LENGTH = 6;
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

export default function VerifyEmailPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Read pendingEmail from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("pendingEmail");
    if (!stored) {
      router.replace("/auth/signup");
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

  // Handle digit input
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // take last char
    setOtp(newOtp);
    setError("");

    // Auto-advance to next box
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    // Focus the last filled box or the next empty one
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmpty]?.focus();
  };

  // Submit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < OTP_LENGTH) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axios.post(
        `${backend_url}/auth/verify-otp`,
        { email, otp: otpString },
        { withCredentials: true }
      );
      setSuccess("Email verified! Taking you home… 🎉");
      sessionStorage.removeItem("pendingEmail");
      await refreshUser();
      setTimeout(() => router.push("/home"), 800);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Verification failed. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = useCallback(async () => {
    if (!email || resending) return;
    setResending(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${backend_url}/auth/resend-otp`, { email });
      setSuccess("A new OTP has been sent to your email.");
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  }, [email, resending, backend_url]);

  // Mask email for display: d*****@gmail.com
  const maskedEmail = email
    ? email.replace(/(.{1})(.*)(@.*)/, (_, a, _b, c) => `${a}${"*".repeat(5)}${c}`)
    : "your email";

  return (
    <PageLayout
      title="Check your inbox"
      subtitle={`We sent a 6-digit code to ${maskedEmail}`}
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

          {/* Email icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl">
              📧
            </div>
          </div>

          {/* OTP Input Boxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter verification code
            </label>
            <div
              className="flex justify-center gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`
                    w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none
                    transition-all duration-200 bg-white
                    ${digit ? "border-orange-400 text-gray-900 shadow-sm" : "border-gray-200 text-gray-400"}
                    focus:border-orange-500 focus:ring-2 focus:ring-orange-100
                    hover:border-orange-300
                  `}
                  autoFocus={index === 0}
                  disabled={loading || !!success}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-500">
                Code expires in{" "}
                <span className={`font-semibold ${timeLeft < 60 ? "text-red-500" : "text-orange-500"}`}>
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                Code expired. Please request a new one.
              </p>
            )}
          </div>

          {/* Verify Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !!success || otp.join("").length < OTP_LENGTH}
          >
            {loading ? "Verifying…" : "Verify Email"}
          </Button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !!success}
                className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? "Sending…" : "Resend OTP"}
              </button>
            </p>
          </div>
        </form>
      </FormCard>

      {/* Back link */}
      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Wrong account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
          >
            Go back to Sign Up
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
