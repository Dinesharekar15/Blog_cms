'use client'

import { useState } from 'react';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  showPasswordToggle = false,
  className = '',
  onFocus,
  onBlur
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPasswordToggle 
    ? (showPassword ? 'text' : 'password') 
    : type;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
          className={`outline-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-gray-900 placeholder-gray-400 ${
            showPasswordToggle && type === 'password' ? 'pr-12' : ''
          }`}
          placeholder={placeholder}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="outline-none absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
          > 
            {showPassword ? (
              <svg className="h-5 w-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.414 1.414M14.12 14.12L9.878 9.878M14.12 14.12L15.536 15.536" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}