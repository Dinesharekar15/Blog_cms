"use client";

import axios from 'axios'
import { useState } from "react";
import Link from "next/link";
import PageLayout from "../../components/ui/PageLayout";
import FormCard from "../../components/ui/FormCard";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function SignUpPage() {
  const router = useRouter();
  const { refreshUser } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const initialformData = { name: "", email: "", password: "" }
  const [formData, setFormData] = useState(initialformData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true);
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        `${backend_url}/auth/signup`,
        { name: formData.name, email: formData.email, password: formData.password },
        { withCredentials: true }
      )

      setSuccess(response.data.msg || 'Account created! Redirecting…')
      await refreshUser()
      setFormData(initialformData)
      setTimeout(() => router.push('/home'), 800)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.msg || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  };

  return (
    <PageLayout
      title="Start Your Publishing Journey"
      subtitle="It only takes a minute to get started"
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

          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />

          <div>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
            {formData.email && !emailRegex.test(formData.email) && (
              <p className="ml-2 text-red-500 mt-1.5 text-xs">
                Please enter a valid email address
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password (min 6 chars)"
              showPasswordToggle={true}
              required
            />
            {formData.password && formData.password.length < 6 && (
              <p className="ml-2 text-red-500 text-xs mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Verify and Sign Up'}
          </Button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-orange-500 hover:text-orange-600 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-orange-500 hover:text-orange-600 underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </FormCard>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>
      </div>
    </PageLayout>
  );
}
