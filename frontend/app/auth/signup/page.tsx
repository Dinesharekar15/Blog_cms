'use client'

import { useState } from 'react';
import Link from 'next/link';
import PageLayout from '../../components/ui/PageLayout';
import FormCard from '../../components/ui/FormCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import PasswordRequirements from '../../components/ui/PasswordRequirements';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <PageLayout 
      title="Start Your Publishing Journey" 
      subtitle="It only takes a minute to get started"
    >
      <FormCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              placeholder="Create a strong password"
              showPasswordToggle={true}
              required
            />
            <PasswordRequirements 
              password={formData.password} 
              show={passwordFocus || !!formData.password} 
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-orange-500 hover:text-orange-600 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-orange-500 hover:text-orange-600 underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </FormCard>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
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