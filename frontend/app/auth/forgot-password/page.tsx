"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import PageLayout from "../../components/ui/PageLayout";
import FormCard from "../../components/ui/FormCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${backend_url}/auth/forgot-password`, { email });

      // Store email for the reset page regardless of whether user exists
      sessionStorage.setItem("resetEmail", email);

      setSuccess(response.data.msg || "Check your email for a reset code.");
      setTimeout(() => router.push("/auth/reset-password"), 1200);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Forgot your password?"
      subtitle="No worries — we'll send you a reset code"
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

          {/* Lock icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-3xl">
              🔐
            </div>
          </div>

          <div>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setError(""); setEmail(e.target.value); }}
              placeholder="Enter your account email"
              required
            />
            {email && !emailRegex.test(email) && (
              <p className="ml-2 text-red-500 mt-1.5 text-xs">
                Please enter a valid email address
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading || !!success}
          >
            {loading ? "Sending reset code…" : "Send Reset Code"}
          </Button>
        </form>
      </FormCard>

      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          Remembered your password?{" "}
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
